#!/usr/bin/env pwsh
# Quick Manual Testing Script
# Run this to get a checklist of things to test manually

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DASHBOARD TESTING CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Prerequisites:" -ForegroundColor Yellow
Write-Host "  [x] npm run dev is running" -ForegroundColor Green
Write-Host "  [x] Open http://localhost:5173" -ForegroundColor Green
Write-Host ""

Write-Host "AUTHENTICATION TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 1. Can view login page" -ForegroundColor White
Write-Host "  [ ] 2. Can login with test@example.com / test123456" -ForegroundColor White
Write-Host "  [ ] 3. Invalid credentials show error" -ForegroundColor White
Write-Host "  [ ] 4. Can logout" -ForegroundColor White
Write-Host ""

Write-Host "DASHBOARD TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 5. Summary cards show numbers" -ForegroundColor White
Write-Host "  [ ] 6. Violations table displays data" -ForegroundColor White
Write-Host "  [ ] 7. Can switch Active/Resolved tabs" -ForegroundColor White
Write-Host "  [ ] 8. View button opens detail modal" -ForegroundColor White
Write-Host "  [ ] 9. Client name shows 'EXAMPLE'" -ForegroundColor White
Write-Host ""

Write-Host "SUBMIT TICKET TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 10. Modal opens" -ForegroundColor White
Write-Host "  [ ] 11. Subject dropdown has 4 options" -ForegroundColor White
Write-Host "  [ ] 12. Can submit ticket" -ForegroundColor White
Write-Host "  [ ] 13. Success message appears" -ForegroundColor White
Write-Host "  [ ] 14. Email received at info@/joe@/kristen@sellercentry.com" -ForegroundColor White
Write-Host ""

Write-Host "INVITE USER TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 15. Modal opens" -ForegroundColor White
Write-Host "  [ ] 16. Can enter email" -ForegroundColor White
Write-Host "  [ ] 17. Invite link displayed" -ForegroundColor White
Write-Host "  [ ] 18. Copy button works" -ForegroundColor White
Write-Host "  [ ] 19. Email received with invite link" -ForegroundColor White
Write-Host ""

Write-Host "DATA INTEGRITY TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 20. Violations loaded from Google Sheets" -ForegroundColor White
Write-Host "  [ ] 21. Correct merchant_id (EXAMPLE123)" -ForegroundColor White
Write-Host "  [ ] 22. User has access (no Access Denied)" -ForegroundColor White
Write-Host ""

Write-Host "MOBILE TESTS:" -ForegroundColor Yellow
Write-Host "  [ ] 23. Open DevTools (F12) > Toggle device toolbar" -ForegroundColor White
Write-Host "  [ ] 24. No horizontal scrolling" -ForegroundColor White
Write-Host "  [ ] 25. All buttons are touch-friendly (44px)" -ForegroundColor White
Write-Host "  [ ] 26. Cards display properly" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Run unit tests: npm test" -ForegroundColor Green
Write-Host "Run E2E tests: npm run test:e2e" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
