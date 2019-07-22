!macro customInstall
  nsExec::Exec '$INSTDIR\resources\openvpn\install\certificate.cmd'
  Delete '$INSTDIR\resources\openvpn\install\certificate.cmd'
  nsExec::Exec '$INSTDIR\resources\openvpn\install\tap-windows.exe /S'
!macroend
