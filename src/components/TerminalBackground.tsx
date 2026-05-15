import { useEffect, useRef } from 'react';

const ARCH_LOGO = [
  '      /\\      ',
  '     /  \\     ',
  '    /\\   \\    ',
  '   /      \\   ',
  '  /   ,,   \\  ',
  ' /   |  |  -\\ ',
  '/_-\'\'    \'\'--\\',
];

const BOOT_LINES = [
  '> BIOS POST... OK',
  '> Memory Test: 65536K OK',
  '> Loading GRUB 2.06...',
  '',
  'Booting \'Arch Linux\'',
  '',
  '[    0.000000] Linux version 6.8.9-arch1-1',
  '[    0.004215] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1',
  '[    0.012004] DMI: CLAYMORE Systems Phantom/Phantom, BIOS v2.1',
  '[    0.024001] tsc: Detected 3600.000 MHz processor',
  '[    0.064107] CPU: Intel Core i7-12700K @ 3.60GHz',
  '[    0.091123] Freeing SMP alternatives memory: 40K',
  '[    0.124008] smpboot: Total of 8 processors activated',
  '[    0.200104] NET: Registered PF_INET protocol family',
  '[    0.312004] PCI: MMCONFIG for domain 0000 [bus 00-ff]',
  '[    0.400108] cryptd: max_cpu_qlen set to 1000',
  '[    0.500012] EXT4-fs (sda1): mounted filesystem',
  '',
  ...ARCH_LOGO,
  '',
  '  OS: Arch Linux x86_64',
  '  Kernel: 6.8.9-arch1-1',
  '  Shell: zsh 5.9',
  '  WM: i3-gaps',
  '  Packages: 1284 (pacman)',
  '  Memory: 2.1G / 32G',
  '',
  '[  OK  ] Started Docker Application Container Engine.',
  '[  OK  ] Started PostgreSQL RDBMS.',
  '[  OK  ] Started Redis Server.',
  '[  OK  ] Started Nginx HTTP Server.',
  '[  OK  ] Started Grafana Server.',
  '[  OK  ] Started Prometheus Monitoring.',
  '[  OK  ] Started SSH Server.',
  '[  OK  ] Started Telegram Bot Service (aiogram).',
  '',
  '> System initialization complete.',
  '> All services operational.',
  '',
  'claymore@phantom:~$ python3 bot.py',
  '  [INFO] Loading configuration...',
  '  [INFO] Connecting to database...',
  '  [INFO] Database connected: PostgreSQL 15.2',
  '  [INFO] Bot polling started successfully',
  '  [INFO] Listening for updates...',
  '',
  'claymore@phantom:~$ docker ps',
  '  CONTAINER ID   IMAGE          STATUS       PORTS',
  '  a3f2e891bc42   bot-prod       Up 47 days   8443',
  '  d12fa90e3b71   postgres:16    Up 47 days   5432',
  '  e7c1209fab83   redis:7        Up 47 days   6379',
  '  f891bc42a3f2   nginx          Up 47 days   80,443',
  '',
  'claymore@phantom:~$ uptime',
  '  21:03:33 up 47 days, load average: 0.12, 0.08, 0.03',
  '',
  'claymore@phantom:~$ tail -f /var/log/bot.log',
  '  [21:03:34] New user registered: #48291',
  '  [21:03:35] Command /start processed',
  '  [21:03:37] Inline query handled: 142ms',
  '  [21:03:39] Callback: task_complete',
  '  [21:03:41] Message forwarded to admin',
  '  [21:03:42] Payment webhook received',
  '  [21:03:44] Database query: 3ms',
  '  [21:03:46] User #12847 completed task #291',
  '  [21:03:48] Subscription verified: @channel_x',
  '  [21:03:50] Penalty applied: user #8291 (fraud)',
  '',
  '> Rebooting sequence...',
  '> ================================',
  '',
];

const AMBER = '#c87a0a';
const DIM_AMBER = '#5a3a08';
const GREEN = '#2a7a2a';

export default function TerminalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lineIndex = 0;
    let charIndex = 0;
    let lines: string[] = [];
    let lastTime = 0;
    let waitUntil = 0;
    let scrollOffset = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const lineH = fontSize * 1.5;

    const draw = (ts: number) => {
      if (!lastTime) lastTime = ts;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      if (ts >= waitUntil) {
        if (lineIndex < BOOT_LINES.length) {
          const currentLine = BOOT_LINES[lineIndex];
          if (currentLine === '') {
            lines.push('');
            lineIndex++;
            waitUntil = ts + 120;
          } else if (charIndex < currentLine.length) {
            charIndex += Math.min(3, currentLine.length - charIndex);
            waitUntil = ts + 8;
          } else {
            lines.push(currentLine);
            lineIndex++;
            charIndex = 0;
            waitUntil = ts + 60;
          }
        } else {
          lineIndex = 0;
          charIndex = 0;
          lines.push('');
        }
      }

      const maxVisible = Math.floor(h / lineH);
      const totalLines = lines.length + (charIndex > 0 ? 1 : 0);
      if (totalLines > maxVisible) {
        const target = (totalLines - maxVisible) * lineH;
        scrollOffset += (target - scrollOffset) * 0.1;
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono', 'Courier New', monospace`;
      ctx.textBaseline = 'top';

      const startY = 20 - scrollOffset;

      for (let i = 0; i < lines.length; i++) {
        const y = startY + i * lineH;
        if (y > h + lineH || y < -lineH) continue;
        const line = lines[i];

        if (line.startsWith('[  OK  ]')) {
          ctx.fillStyle = GREEN;
          ctx.fillText('[  OK  ]', 20, y);
          ctx.fillStyle = DIM_AMBER;
          ctx.fillText(line.substring(8), 20 + ctx.measureText('[  OK  ]').width, y);
        } else if (line.startsWith('>')) {
          ctx.fillStyle = AMBER;
          ctx.fillText(line, 20, y);
        } else if (line.startsWith('claymore@')) {
          ctx.fillStyle = GREEN;
          const prompt = line.split('$')[0] + '$';
          ctx.fillText(prompt, 20, y);
          ctx.fillStyle = DIM_AMBER;
          ctx.fillText(line.substring(prompt.length), 20 + ctx.measureText(prompt).width, y);
        } else {
          ctx.fillStyle = DIM_AMBER;
          ctx.fillText(line, 20, y);
        }
      }

      // Typing line + cursor
      if (lineIndex < BOOT_LINES.length && charIndex > 0) {
        const partial = BOOT_LINES[lineIndex].substring(0, charIndex);
        const y = startY + lines.length * lineH;
        if (y > -lineH && y < h + lineH) {
          ctx.fillStyle = AMBER;
          ctx.fillText(partial, 20, y);
          if (Math.floor(ts / 500) % 2 === 0) {
            ctx.fillRect(20 + ctx.measureText(partial).width, y, 7, fontSize);
          }
        }
      }

      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let sy = 0; sy < h; sy += 3) {
        ctx.fillRect(0, sy, w, 1);
      }

      lastTime = ts;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}
