title Anti-Upgrade
reg add "HKEY_CURRENT_USER\Software\Tencent\WeChat" /v "NeedUpdateType" /t reg_dword /d "0" /f >nul 2>nul
echo NEED-UPDATE-CHANGE-DONE

del /f /q %USERPROFILE%\AppData\Roaming\Tencent\WeChat\"All Users"\config\update.data >nul 2>nul
md %USERPROFILE%\AppData\Roaming\Tencent\WeChat\"All Users"\config\update.data >nul 2>nul
echo Y|cacls "%USERPROFILE%\AppData\Roaming\Tencent\WeChat\All Users\config\update.data" /T /P %USERNAME%:N >nul 2>nul
echo UPDATE-MODIFY-DONE

rd /s /q %USERPROFILE%\AppData\Roaming\Tencent\WeChat\patch >nul 2>nul
md %USERPROFILE%\AppData\Roaming\Tencent\WeChat\patch >nul 2>nul
echo Y|cacls %USERPROFILE%\AppData\Roaming\Tencent\WeChat\patch /T /P %USERNAME%:N >nul 2>nul
echo PATCH-EDIT-DONE

echo SETTING-SUCCESS-EXITING
timeout /nobreak /t 2 >nul 2>nul

pause
exit
