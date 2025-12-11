import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  const crypto = globalThis.crypto
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  for (let i = 0; i < 32; i++) {
    token += chars[array[i] % chars.length]
  }
  return token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, merchantId, expiresInDays = 7 } = await req.json()

    if (!email || !merchantId) {
      return new Response(
        JSON.stringify({ error: 'Email and merchantId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const token = req.headers.get('Authorization')!.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const inviteToken = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const { data: invite, error: insertError } = await supabase
      .from('invites')
      .insert({
        email,
        token: inviteToken,
        merchant_id: merchantId,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create invite' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const origin = req.headers.get('origin') || 'https://sellercentry.com'
    const inviteUrl = `${origin}/signup?token=${inviteToken}`

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          inviteUrl,
          warning: 'Invite created but email could not be sent (RESEND_API_KEY not configured)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (resendApiKey) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">You're Invited!</h2>
              </div>
              <div class="content">
                <p>You've been invited to join the Account Health Dashboard.</p>
                <p>Click the button below to create your account:</p>
                <a href="${inviteUrl}" class="button">Accept Invitation</a>
                <p style="color: #666; font-size: 14px;">
                  This invitation will expire in ${expiresInDays} days.
                </p>
                <p style="color: #666; font-size: 12px;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
            </div>
          </body>
        </html>
      `

      console.log('📧 Sending email to:', email)
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Seller Centry <noreply@notifications.sellercentry.com>',
          to: [email],
          subject: 'You are invited to Seller Centry Dashboard',
          html: emailHtml,
        }),
      })

      const emailResult = await emailResponse.json()
      console.log('📬 Resend API response:', emailResult)

      if (!emailResponse.ok) {
        console.error('❌ Failed to send email:', emailResult)
        return new Response(
          JSON.stringify({ 
            success: true,
            token: inviteToken,
            inviteUrl,
            expiresAt: expiresAt.toISOString(),
            warning: 'Invite created but email could not be sent. Please copy the invite link manually.',
            emailError: emailResult
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ Email sent successfully')
    }

    return new Response(
      JSON.stringify({
        success: true,
        token: inviteToken,
        inviteUrl,
        expiresAt: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
