Unicode true
!include "MUI2.nsh"

Name "NEXUS DATA"
OutFile "installer_out\\NexusDataSetup-0.4.0.exe"
InstallDir "$LOCALAPPDATA\NexusDataApp"
RequestExecutionLevel user
SetCompressor /SOLID lzma
ShowInstDetails show
ShowUninstDetails show

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "NEXUS DATA" SEC_MAIN
  SetOutPath "$INSTDIR"
  File /r "payload\*.*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateDirectory "$SMPROGRAMS\NEXUS DATA"
  CreateShortcut "$SMPROGRAMS\NEXUS DATA\NEXUS DATA.lnk" "$INSTDIR\Nexus Data.cmd"
  CreateShortcut "$SMPROGRAMS\NEXUS DATA\Uninstall NEXUS DATA.lnk" "$INSTDIR\Uninstall.exe"
  CreateShortcut "$DESKTOP\NEXUS DATA.lnk" "$INSTDIR\Nexus Data.cmd"
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\NEXUS DATA.lnk"
  Delete "$SMPROGRAMS\NEXUS DATA\NEXUS DATA.lnk"
  Delete "$SMPROGRAMS\NEXUS DATA\Uninstall NEXUS DATA.lnk"
  RMDir "$SMPROGRAMS\\NEXUS DATA"
  RMDir /r "$INSTDIR"
  Delete "$INSTDIR\\Uninstall.exe"
SectionEnd
