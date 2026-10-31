# Локальный сервер планнера. Слушает только этот компьютер: 127.0.0.1:8765.
# Запускается из start-hub.bat, отдельно открывать не нужно.
#
# Почему TcpListener, а не HttpListener: HttpListener на Windows требует прав
# администратора (без них — «Access is denied»). TcpListener работает у
# обычного пользователя, и для одной страницы этого достаточно.
#
# Зачем сервер вообще нужен: браузер привязывает данные страницы к адресу.
# Пока адрес тот же (http://127.0.0.1:8765), старые записи остаются на месте.

$ErrorActionPreference = 'Stop'
$port = 8765
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$page = Join-Path $root 'planner.html'
$rootFull = [System.IO.Path]::GetFullPath($root)

if (-not (Test-Path -LiteralPath $page)) {
  Write-Host ''
  Write-Host 'Не найден planner.html рядом с server.ps1.'
  Write-Host 'Распакуйте архив целиком и запустите start-hub.bat из папки planner-local.'
  Write-Host ''
  exit 1
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
try {
  $listener.Start()
} catch {
  Write-Host ''
  Write-Host "Порт $port занят — скорее всего, планнер уже открыт в другом окне."
  Write-Host 'Закройте старое окно и запустите снова.'
  Write-Host ''
  exit 1
}

Write-Host ''
Write-Host "Планнер открыт: http://127.0.0.1:$port/"
Write-Host 'Это окно закрывать нельзя, пока работаете. Закончили — закройте его.'
Write-Host ''

Start-Process "http://127.0.0.1:$port/"

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $stream.ReadTimeout = 5000

      $buffer = New-Object byte[] 8192
      $read = $stream.Read($buffer, 0, $buffer.Length)
      $request = ''
      if ($read -gt 0) { $request = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $read) }

      $target = '/'
      $firstLine = ($request -split "`r`n")[0]
      if ($firstLine) {
        $parts = $firstLine -split ' '
        if ($parts.Length -ge 2) { $target = $parts[1] }
      }
      $target = ($target -split '\?')[0]

      $relative = [Uri]::UnescapeDataString($target).TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'planner.html' }

      $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      $inside = $candidate.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)

      $status = '200 OK'
      if ($inside -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        $body = [System.IO.File]::ReadAllBytes($candidate)
      } else {
        $status = '404 Not Found'
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
      }

      $type = 'text/html; charset=utf-8'
      if ($candidate.EndsWith('.js', [StringComparison]::OrdinalIgnoreCase)) { $type = 'text/javascript; charset=utf-8' }
      if ($candidate.EndsWith('.json', [StringComparison]::OrdinalIgnoreCase)) { $type = 'application/json; charset=utf-8' }

      $header = "HTTP/1.1 $status`r`n" +
                "Content-Type: $type`r`n" +
                "Content-Length: $($body.Length)`r`n" +
                "Cache-Control: no-store, no-cache, must-revalidate`r`n" +
                "Connection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)

      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
    } catch {
      # одна неудачная страница не должна ронять сервер
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
