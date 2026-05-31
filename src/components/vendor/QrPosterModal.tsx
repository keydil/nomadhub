import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    QrCode,
    Printer,
    Download,
    Globe
} from 'lucide-react';

interface QrPosterModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeName: string;
    logoImage: string;
    tempSlogan: string;
    onNotification: (message: string) => void;
}

export const QrPosterModal: React.FC<QrPosterModalProps> = ({
    isOpen,
    onClose,
    storeName,
    logoImage,
    tempSlogan,
    onNotification
}) => {
    const [qrTableNumber, setQrTableNumber] = useState('');
    const [qrPosterColor, setQrPosterColor] = useState('amber'); // Themes: 'amber', 'slate', 'red', 'emerald', 'indigo'
    const [qrSlogan, setQrSlogan] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setQrSlogan(tempSlogan);
        }
    }, [isOpen, tempSlogan]);

    // PRINT POSTER DIRECTLY VIA ISOLATED IFRAME SYSTEM
    const handlePrintPoster = () => {
        const targetQrUrl = `https://nomadhub.biz.id/${storeName.replace(/\s+/g, '-').toLowerCase()}${qrTableNumber ? '?table=' + encodeURIComponent(qrTableNumber) : ''}`;
        const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&data=${encodeURIComponent(targetQrUrl)}`;

        // Theme styling definitions
        const themeColors = {
            amber: { border: '#d97706', bg: '#fef3c7', text: '#92400e', badge: '#fffbeb' },
            slate: { border: '#1c1917', bg: '#f5f5f4', text: '#292524', badge: '#fafaf9' },
            red: { border: '#dc2626', bg: '#fee2e2', text: '#991b1b', badge: '#fef2f2' },
            emerald: { border: '#059669', bg: '#d1fae5', text: '#065f46', badge: '#f0fdf4' },
            indigo: { border: '#4f46e5', bg: '#e0e7ff', text: '#3730a3', badge: '#eef2ff' },
        };

        const activeColor = themeColors[qrPosterColor as keyof typeof themeColors] || themeColors.amber;

        const printContent = `
      <html>
        <head>
          <title>Poster QR Kedai - ${storeName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
              width: 210mm; 
              height: 297mm; 
              background: white; 
              font-family: 'Inter', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .poster-container {
              width: 180mm;
              height: 260mm;
              border: 10px double ${activeColor.border};
              border-radius: 20px;
              padding: 15mm;
              background: white;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              text-align: center;
              color: #171717;
            }
            .badge {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 14px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: ${activeColor.border};
              background: ${activeColor.badge};
              border: 2px solid ${activeColor.border};
              border-radius: 30px;
              padding: 8px 18px;
              display: inline-block;
            }
            .logo-circle {
              width: 80px;
              height: 80px;
              border-radius: 50px;
              border: 3px solid ${activeColor.border};
              overflow: hidden;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 32px;
              color: ${activeColor.border};
              margin-top: 20px;
            }
            .logo-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .brand-name {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 42px;
              margin: 15px 0 5px 0;
              color: ${activeColor.border};
              text-transform: uppercase;
              letter-spacing: -0.5px;
            }
            .slogan {
              font-size: 18px;
              font-style: italic;
              color: #52525b;
              max-width: 90%;
              line-height: 1.5;
              margin: 0 auto 30px auto;
            }
            .qr-box {
              border: 5px solid ${activeColor.border};
              border-radius: 24px;
              padding: 20px;
              background: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 260px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            .qr-image {
              width: 220px;
              height: 220px;
              margin-bottom: 12px;
            }
            .scan-text {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 13px;
              letter-spacing: 1px;
              color: ${activeColor.border};
              text-transform: uppercase;
            }
            .table-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 20px;
              background: #171717;
              color: #ffffff;
              font-weight: 700;
              padding: 10px 24px;
              border-radius: 12px;
              margin-top: 25px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .footer-section {
              border-top: 2px dashed ${activeColor.border};
              padding-top: 20px;
              width: 100%;
              margin-top: 30px;
            }
            .footer-text {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 14px;
              letter-spacing: 1.5px;
              color: #52525b;
              text-transform: uppercase;
            }
            .sub-footer-text {
              font-size: 11px;
              color: #a3a3a3;
              margin-top: 4px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="poster-container">
            <div>
              <span class="badge">MENU DIGITAL RESMI</span>
            </div>
            
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div class="logo-circle">
                ${logoImage ? `<img src="${logoImage}" class="logo-img" onerror="this.outerHTML='<span>${storeName.charAt(0).toUpperCase()}</span>'" />` : `<span>${storeName.charAt(0).toUpperCase()}</span>`}
              </div>
              <h1 class="brand-name">${storeName}</h1>
              <p class="slogan">"${qrSlogan || tempSlogan}"</p>
            </div>
            
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div class="qr-box">
                <img src="${qrCodeImgSrc}" class="qr-image" />
                <span class="scan-text">SCAN UNTUK PESAN MEJA</span>
              </div>
              ${qrTableNumber ? `<div class="table-badge">MEJA ${qrTableNumber}</div>` : ''}
            </div>
            
            <div class="footer-section">
              <div class="footer-text">NOMADHUB MERCHANT PARTNER</div>
              <div class="sub-footer-text">Sistem Pemesanan Digital Berbasis QR Code - Bebas Antre</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 650);
            }
          </script>
        </body>
      </html>
    `;

        // Create printable isolated iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(printContent);
            iframeDoc.close();
        }

        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 20000);

        onNotification('🖨️ Mengirim desain poster ke antrean cetak browser...');
    };

    // EXPORT HIGH-RESOLUTION POSTER (PNG) VIA CANVAS DRAWING
    const handleDownloadPoster = () => {
        setIsExporting(true);
        onNotification('🎨 Mengonstruksi seni poster resolusi tinggi (1200x1800)...');

        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1800;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsExporting(false);
            return;
        }

        const targetQrUrl = `https://nomadhub.biz.id/${storeName.replace(/\s+/g, '-').toLowerCase()}${qrTableNumber ? '?table=' + encodeURIComponent(qrTableNumber) : ''}`;
        const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=H&data=${encodeURIComponent(targetQrUrl)}`;

        const themeColors = {
            amber: { border: '#d97706', bg: '#fef3c7', text: '#92400e', badge: '#fffbeb' },
            slate: { border: '#1c1917', bg: '#f5f5f4', text: '#292524', badge: '#fafaf9' },
            red: { border: '#dc2626', bg: '#fee2e2', text: '#991b1b', badge: '#fef2f2' },
            emerald: { border: '#059669', bg: '#d1fae5', text: '#065f46', badge: '#f0fdf4' },
            indigo: { border: '#4f46e5', bg: '#e0e7ff', text: '#3730a3', badge: '#eef2ff' },
        };
        const activeColor = themeColors[qrPosterColor as keyof typeof themeColors] || themeColors.amber;

        // Canvas Text Wrapping Helper
        const wrapText = (c: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
            const words = text.split(' ');
            let line = '';
            let currentY = y;
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = c.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    c.fillText(line, x, currentY);
                    line = words[n] + ' ';
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            c.fillText(line, x, currentY);
        };

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 1800);

        // Double frame borders
        ctx.lineWidth = 14;
        ctx.strokeStyle = activeColor.border;
        ctx.strokeRect(40, 40, 1120, 1720);

        ctx.lineWidth = 4;
        ctx.strokeStyle = activeColor.border;
        ctx.strokeRect(65, 65, 1070, 1670);

        // Header Badge Background
        ctx.fillStyle = activeColor.badge;
        ctx.beginPath();

        // Fallback roundRect support
        if (ctx.roundRect) {
            ctx.roundRect(400, 110, 400, 70, 35);
        } else {
            ctx.rect(400, 110, 400, 70);
        }
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = activeColor.border;
        ctx.stroke();

        // Header Badge Text
        ctx.fillStyle = activeColor.border;
        ctx.font = 'bold 24px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MENU DIGITAL RESMI', 600, 145);

        // Draw Store Initial Fallback circle (to use if image fails loading)
        const drawLogoCircleFallback = () => {
            ctx.save();
            ctx.fillStyle = activeColor.border;
            ctx.beginPath();
            ctx.arc(600, 320, 85, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 85px Arial, Helvetica, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(storeName.charAt(0).toUpperCase(), 600, 320);
            ctx.restore();
        };

        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.src = qrCodeImgSrc;

        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = logoImage;

        let qrLoaded = false;
        let logoLoaded = false;

        const performFinalDraw = () => {
            // 1. Draw logo avatar circle
            if (logoLoaded && logoImg.complete) {
                try {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(600, 320, 85, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(logoImg, 515, 235, 170, 170);
                    ctx.restore();

                    // Ring border
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = activeColor.border;
                    ctx.beginPath();
                    ctx.arc(600, 320, 86, 0, Math.PI * 2);
                    ctx.stroke();
                } catch (e) {
                    drawLogoCircleFallback();
                }
            } else {
                drawLogoCircleFallback();
            }

            // 2. Brand Name
            ctx.fillStyle = activeColor.border;
            ctx.font = 'bold 64px Arial, Helvetica, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(storeName.toUpperCase(), 600, 475);

            // 3. Slogan italic wrap
            ctx.fillStyle = '#4b5563';
            ctx.font = 'italic 32px Arial, Helvetica, sans-serif';
            wrapText(ctx, `"${qrSlogan || tempSlogan}"`, 600, 550, 920, 48);

            // 4. White box for QR Code
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.08)';
            ctx.shadowBlur = 45;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 15;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(380, 750, 440, 520, 40);
            } else {
                ctx.rect(380, 750, 440, 520);
            }
            ctx.fill();
            ctx.shadowBlur = 0; // Disable shadows

            // QR box stroke
            ctx.lineWidth = 6;
            ctx.strokeStyle = activeColor.border;
            ctx.stroke();

            // QR Code Image drawing
            if (qrLoaded && qrImg.complete) {
                try {
                    ctx.drawImage(qrImg, 420, 790, 360, 360);
                } catch (e) {
                    ctx.fillStyle = '#ef4444';
                    ctx.font = 'bold 24px sans-serif';
                    ctx.fillText('Gagal menggambar QR', 600, 970);
                }
            } else {
                ctx.fillStyle = '#9ca3af';
                ctx.font = '24px sans-serif';
                ctx.fillText('Memuat QR Code...', 600, 970);
            }

            // Scan Instructions Text
            ctx.fillStyle = activeColor.border;
            ctx.font = 'bold 26px Arial, Helvetica, sans-serif';
            ctx.fillText('SCAN UNTUK PESAN & MENU', 600, 1215);

            // 5. Table Badge
            if (qrTableNumber) {
                ctx.fillStyle = '#171717';
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(420, 1340, 360, 80, 20);
                } else {
                    ctx.rect(420, 1340, 360, 80);
                }
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 30px Arial, Helvetica, sans-serif';
                ctx.fillText(`MEJA: ${qrTableNumber.toUpperCase()}`, 600, 1390);
            }

            // 6. Dash boundary separator
            ctx.lineWidth = 4;
            ctx.strokeStyle = activeColor.border;
            ctx.setLineDash([15, 15]);
            ctx.beginPath();
            ctx.moveTo(100, 1500);
            ctx.lineTo(1100, 1500);
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // 7. Footer branding
            ctx.fillStyle = '#4b5563';
            ctx.font = 'bold 30px Arial, Helvetica, sans-serif';
            ctx.fillText('NOMADHUB MERCHANT PARTNER', 600, 1565);

            ctx.fillStyle = '#9ca3af';
            ctx.font = 'bold 22px Arial, Helvetica, sans-serif';
            ctx.fillText('Sistem Order & Kasir Digital Berbasis Meja - Bebas Antre', 600, 1615);

            // 8. Convert to link and trigger auto download
            try {
                const urlToDownload = canvas.toDataURL('image/png');
                const trigger = document.createElement('a');
                trigger.href = urlToDownload;
                trigger.download = `NomadHub_Poster_QR_${storeName.replace(/\s+/g, '_')}${qrTableNumber ? '_Meja_' + qrTableNumber : ''}.png`;
                document.body.appendChild(trigger);
                trigger.click();
                document.body.removeChild(trigger);
                onNotification('📥 Selesai! Poster QR beresolusi super tajam berhasil diunduh.');
            } catch (e) {
                onNotification('❌ Gagal merender gambar PNG karena batasan keamanan. Silakan cetak directly!');
            }
            setIsExporting(false);
        };

        let waitingCount = 2;
        const itemLoaded = () => {
            waitingCount--;
            if (waitingCount === 0) {
                performFinalDraw();
            }
        };

        qrImg.onload = () => {
            qrLoaded = true;
            itemLoaded();
        };
        qrImg.onerror = () => {
            qrLoaded = false;
            itemLoaded();
        };

        logoImg.onload = () => {
            logoLoaded = true;
            itemLoaded();
        };
        logoImg.onerror = () => {
            logoLoaded = false;
            itemLoaded();
        };

        // Fail-safe protection if network drops
        setTimeout(() => {
            if (waitingCount > 0) {
                performFinalDraw();
            }
        }, 4000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-stone-950/70 backdrop-blur-md z-50 transition-all cursor-pointer"
                    />

                    {/* Central Dialog Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, translateY: '10%' }}
                        animate={{ scale: 1, opacity: 1, translateY: '0%' }}
                        exit={{ scale: 0.95, opacity: 0, translateY: '10%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                        className="absolute bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-4xl h-[95%] md:h-[85%] bg-[#FAF9F5] border-t md:border border-stone-200/95 shadow-2xl rounded-t-[32px] md:rounded-[36px] z-55 flex flex-col overflow-hidden text-stone-800 font-sans"
                    >
                        {/* Decorative Pull Bar for Mobile */}
                        <div className="w-12 h-1 bg-stone-250 rounded-full mx-auto mt-3 md:hidden flex-shrink-0" />

                        {/* Dialog Header */}
                        <div className="px-6 py-4 border-b border-stone-200/80 bg-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
                                    <QrCode className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-stone-900 tracking-wide uppercase leading-none">Kreator QR Meja Jualan</h3>
                                    <p className="text-[9px] text-stone-400 font-bold mt-1 uppercase tracking-widest leading-none">Cetak QR Poster Siap Tempel</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center active:scale-90 transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Dialog Body Layout: 2 Columns */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* LEFT COLUMN: Controls Panel */}
                            <div className="md:col-span-5 space-y-5 flex flex-col justify-start">

                                {/* Theme Preset Selector */}
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase font-black tracking-wider text-stone-450 block">Pilih Tema Poster</label>
                                    <div className="grid grid-cols-5 gap-1.5">
                                        {[
                                            { id: 'amber', name: 'Emas', color: 'bg-amber-500 border-amber-600' },
                                            { id: 'slate', name: 'Hitam', color: 'bg-stone-800 border-stone-950' },
                                            { id: 'red', name: 'Merah', color: 'bg-red-650 border-red-700' },
                                            { id: 'emerald', name: 'Hijau', color: 'bg-emerald-600 border-emerald-700' },
                                            { id: 'indigo', name: 'Biru', color: 'bg-indigo-600 border-indigo-700' }
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setQrPosterColor(theme.id)}
                                                className={`rounded-2xl p-2 text-center border-2 flex flex-col items-center gap-1.5 transition active:scale-95 cursor-pointer ${qrPosterColor === theme.id
                                                        ? 'border-stone-800 bg-white shadow-sm'
                                                        : 'border-transparent bg-stone-100 hover:bg-stone-200/60'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full ${theme.color} border shadow-inner`} />
                                                <span className="text-[8.5px] font-extrabold text-stone-700 leading-none">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Table Number Badging System */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[9px] uppercase font-black tracking-wider text-stone-450">Nomor Meja Pelanggan</label>
                                        <span className="text-[8.5px] text-stone-400 font-bold uppercase">Optional</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={8}
                                            placeholder="Contoh: 01, A3, VIP (Kosongkan jika Umum)"
                                            value={qrTableNumber}
                                            onChange={(e) => setQrTableNumber(e.target.value)}
                                            className="w-full bg-white border border-stone-200 focus:outline-none focus:border-amber-500 p-2.5 rounded-xl text-xs font-bold text-stone-800 uppercase"
                                        />
                                    </div>
                                    <p className="text-[8px] text-stone-400 font-medium leading-relaxed">
                                        *Sistem NomadHub otomatis melacak meja saat pelanggan melakukan scan checkout pesanan ini.
                                    </p>
                                </div>

                                {/* Poster Slogan Editor */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] uppercase font-black tracking-wider text-stone-450 block">Bio/Slogan Ajakan Poster</label>
                                    <textarea
                                        rows={2}
                                        maxLength={60}
                                        value={qrSlogan}
                                        onChange={(e) => setQrSlogan(e.target.value)}
                                        placeholder="Kata ajakan ramah di poster..."
                                        className="w-full bg-white border border-stone-200 focus:outline-none focus:border-amber-500 p-2.5 rounded-xl text-xs font-bold text-stone-800"
                                    />
                                    <div className="flex justify-between text-[8px] text-stone-450 font-bold">
                                        <span>Slogan ramah menarik pelanggan scan</span>
                                        <span>{qrSlogan.length}/60 Karakter</span>
                                    </div>
                                </div>

                                {/* Dynamic Target Link Info */}
                                <div className="bg-stone-100/80 border border-stone-200 p-3 rounded-2xl space-y-1">
                                    <div className="flex items-center gap-1.5 text-[8.5px] font-black text-stone-450">
                                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                                        <span>ALAMAT TUJUAN QR (INTEGRATED LINK)</span>
                                    </div>
                                    <p className="font-mono text-[9px] break-all font-bold text-stone-600 block pl-5">
                                        https://nomadhub.biz.id/{storeName.replace(/\s+/g, '-').toLowerCase()}
                                        {qrTableNumber && (
                                            <span className="text-amber-550 font-extrabold font-mono">?table={encodeURIComponent(qrTableNumber)}</span>
                                        )}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-2 pt-2 mt-auto">
                                    <button
                                        onClick={handlePrintPoster}
                                        className="w-full bg-stone-900 hover:bg-stone-850 text-white text-[10.5px] font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md cursor-pointer"
                                    >
                                        <Printer className="w-4 h-4 text-amber-500" />
                                        <span>CETAK SEKARANG (SYSTEM PRINT)</span>
                                    </button>

                                    <button
                                        onClick={handleDownloadPoster}
                                        disabled={isExporting}
                                        className="w-full bg-white hover:bg-stone-50 border border-stone-250 text-stone-800 text-[10.5px] font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98 shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        {isExporting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
                                                <span>MENYUSUN POSTER HD...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4 text-emerald-600" />
                                                <span>UNDUH DRAFT GAMBAR (PNG COCOK SHARE)</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>

                            {/* RIGHT COLUMN: HD Live Poster Preview */}
                            <div className="md:col-span-7 bg-stone-100/70 border border-stone-200/50 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[460px] relative shadow-inner">

                                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-stone-900/10 text-[8px] font-bold text-stone-500 tracking-wider">
                                    LIVE REAL-TIME PREVIEW POSTER (A4 SIZE MATCH)
                                </div>

                                {(() => {
                                    const previewThemeClassesMock = {
                                        amber: {
                                            border: 'border-amber-600',
                                            text: 'text-amber-900',
                                            accentText: 'text-amber-700',
                                            bg: 'bg-amber-50/70',
                                            badge: 'bg-amber-100 text-amber-800 border-amber-300'
                                        },
                                        slate: {
                                            border: 'border-stone-800',
                                            text: 'text-stone-900',
                                            accentText: 'text-stone-700',
                                            bg: 'bg-stone-50/70',
                                            badge: 'bg-stone-100 text-stone-800 border-stone-300'
                                        },
                                        red: {
                                            border: 'border-red-600',
                                            text: 'text-red-900',
                                            accentText: 'text-red-700',
                                            bg: 'bg-red-50/70',
                                            badge: 'bg-red-100 text-red-800 border-red-300'
                                        },
                                        emerald: {
                                            border: 'border-emerald-600',
                                            text: 'text-emerald-900',
                                            accentText: 'text-emerald-700',
                                            bg: 'bg-emerald-50/70',
                                            badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        },
                                        indigo: {
                                            border: 'border-indigo-600',
                                            text: 'text-indigo-900',
                                            accentText: 'text-indigo-700',
                                            bg: 'bg-indigo-50/70',
                                            badge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                        }
                                    };

                                    const theme = previewThemeClassesMock[qrPosterColor as keyof typeof previewThemeClassesMock] || previewThemeClassesMock.amber;
                                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&ecc=M&data=${encodeURIComponent(
                                        `https://nomadhub.biz.id/${storeName.replace(/\s+/g, '-').toLowerCase()}${qrTableNumber ? '?table=' + encodeURIComponent(qrTableNumber) : ''}`
                                    )}`;

                                    return (
                                        <div className={`w-[290px] sm:w-[320px] aspect-[1/1.42] bg-white border-8 border-double ${theme.border} rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-2xl relative select-none`}>

                                            {/* Corner decorations */}
                                            <div className={`absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${theme.border}`} />
                                            <div className={`absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${theme.border}`} />
                                            <div className={`absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${theme.border}`} />
                                            <div className={`absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${theme.border}`} />

                                            {/* Header Badge */}
                                            <div>
                                                <span className={`text-[9px] font-black tracking-widest px-2.5 py-0.5 border rounded-full uppercase ${theme.badge}`}>
                                                    Menu Digital Resmi
                                                </span>
                                            </div>

                                            {/* Identity header area */}
                                            <div className="flex flex-col items-center space-y-1 mt-2.5">
                                                <div className={`w-13 h-13 rounded-full border-2 ${theme.border} overflow-hidden bg-stone-50 flex items-center justify-center`}>
                                                    {logoImage ? (
                                                        <img
                                                            src={logoImage}
                                                            alt="Mockup brand"
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    ) : (
                                                        <span className={`text-xl font-black ${theme.accentText}`}>
                                                            {storeName.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                <h2 className={`text-base font-extrabold uppercase tracking-tight mt-1 leading-none ${theme.text}`}>
                                                    {storeName}
                                                </h2>

                                                <p className="text-[10px] text-stone-500 italic px-2 font-medium max-w-[240px] leading-relaxed mt-1">
                                                    "{qrSlogan || tempSlogan}"
                                                </p>
                                            </div>

                                            {/* Central QR panel */}
                                            <div className="flex flex-col items-center space-y-1.5 my-3 flex-1 justify-center">
                                                <div className={`border-[3.5px] ${theme.border} rounded-2xl p-2.5 bg-white shadow-md w-38 h-38 flex flex-col items-center justify-center`}>
                                                    <img
                                                        src={qrCodeUrl}
                                                        alt="Preview QR Code"
                                                        className="w-full h-full object-contain"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>

                                                <span className={`text-[8.5px] font-black tracking-wider uppercase leading-none pt-1 ${theme.text}`}>
                                                    Scan Untuk Pesan & Bayar
                                                </span>
                                            </div>

                                            {/* Dynamic Table Badge */}
                                            {qrTableNumber ? (
                                                <div className="bg-stone-900 border border-stone-950 text-white rounded-lg px-4 py-1.5 flex items-center justify-center leading-none mt-1 shadow-sm shrink-0">
                                                    <span className="font-mono font-black text-[10px] uppercase tracking-wider">
                                                        Meja: {qrTableNumber}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="h-4" />
                                            )}

                                            {/* Footer Area */}
                                            <div className={`border-t border-dashed ${theme.border} w-full pt-1.5 mt-2`}>
                                                <div className="text-[8.5px] font-black tracking-wide text-stone-500 uppercase leading-none">
                                                    NOMADHUB MERCHANT PARTNER
                                                </div>
                                                <div className="text-[7px] font-bold text-stone-400 mt-1 uppercase leading-none">
                                                    Sistem Order Digital - Pembayaran Bebas Antre
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })()}

                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
