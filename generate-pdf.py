#!/usr/bin/env python3
import os
import sys
from html import escape

def create_pdf_html():
    """Create a compact HTML that fits in 1 page A4"""
    html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mohamed Chennani — Curriculum Vitae</title>
    <style>
        /* Reset compacto */
        * { margin:0; padding:0; box-sizing:border-box; }
        
        /* Configuración A4 optimizada */
        body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            font-size: 9.5pt; /* Muy compacto */
            line-height: 1.25; /* Muy compacto */
            color: #333;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 8mm 12mm; /* Muy compacto */
            background: white;
        }
        
        /* Header ultra compacto */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #2c5282;
        }
        
        .name {
            font-size: 18px;
            font-weight: 700;
            color: #2c5282;
            margin: 0;
        }
        
        .title {
            font-size: 11px;
            color: #4a5568;
            margin: 0;
            font-weight: 500;
        }
        
        .contact {
            text-align: right;
            font-size: 8pt;
            line-height: 1.2;
        }
        
        .contact div {
            margin-bottom: 1px;
        }
        
        /* Secciones ultra compactas */
        .section {
            margin-bottom: 8px;
        }
        
        .section-title {
            font-size: 10px;
            font-weight: 700;
            color: #2c5282;
            margin: 0 0 4px 0;
            padding-bottom: 1px;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
        }
        
        /* Resumen ultra compacto */
        .summary {
            font-size: 9pt;
            line-height: 1.3;
            color: #4a5568;
            margin-bottom: 8px;
            text-align: justify;
        }
        
        /* Experiencia ultra compacta */
        .exp-item {
            margin-bottom: 6px;
        }
        
        .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0;
        }
        
        .exp-role {
            font-size: 9.5px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
        }
        
        .exp-company {
            font-size: 8.5px;
            color: #4a5568;
            font-weight: 500;
        }
        
        .exp-period {
            font-size: 8px;
            color: #718096;
            white-space: nowrap;
        }
        
        .exp-desc {
            font-size: 8px;
            color: #4a5568;
            margin: 0;
            line-height: 1.2;
        }
        
        /* Habilidades ultra compactas (solo 6 principales) */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px 8px;
        }
        
        .skill-item {
            margin-bottom: 3px;
        }
        
        .skill-name {
            font-size: 8px;
            color: #4a5568;
            margin-bottom: 1px;
            display: flex;
            justify-content: space-between;
        }
        
        .skill-bar {
            height: 2px;
            background: #e2e8f0;
            border-radius: 1px;
            overflow: hidden;
        }
        
        .skill-fill {
            height: 100%;
            background: #2c5282;
            border-radius: 1px;
        }
        
        /* Proyectos ultra compactos (solo 2) */
        .project-item {
            margin-bottom: 6px;
        }
        
        .project-title {
            font-size: 9px;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 1px 0;
        }
        
        .project-category {
            font-size: 7.5px;
            color: #718096;
            margin: 0 0 2px 0;
            font-weight: 500;
        }
        
        .project-desc {
            font-size: 8px;
            color: #4a5568;
            line-height: 1.2;
            margin: 0;
        }
        
        /* Idiomas ultra compactos */
        .langs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
        }
        
        .lang-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .lang-name {
            font-size: 8px;
            color: #4a5568;
        }
        
        .lang-level {
            font-size: 7.5px;
            color: #718096;
            font-weight: 500;
        }
        
        /* Certificaciones ultra compactas (solo 2) */
        .cert-item {
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
        }
        
        .cert-title {
            font-size: 8px;
            color: #2d3748;
            font-weight: 500;
            margin: 0;
        }
        
        .cert-org {
            font-size: 7.5px;
            color: #718096;
            margin: 0;
        }
        
        .cert-year {
            font-size: 7.5px;
            color: #718096;
            white-space: nowrap;
            margin-left: 6px;
        }
        
        /* Educación ultra compacta */
        .edu-item {
            margin-bottom: 6px;
        }
        
        .edu-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0;
        }
        
        .edu-title {
            font-size: 9px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
        }
        
        .edu-org {
            font-size: 8px;
            color: #4a5568;
            margin: 0;
        }
        
        .edu-loc {
            font-size: 7.5px;
            color: #718096;
            margin: 0;
        }
        
        /* Footer ultra pequeño */
        .footer {
            margin-top: 10px;
            padding-top: 4px;
            border-top: 1px solid #e2e8f0;
            font-size: 6.5px;
            color: #718096;
            text-align: center;
        }
        
        /* Utilidades para impresión */
        @media print {
            body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 8mm 12mm;
            }
            
            @page {
                size: A4;
                margin: 8mm 12mm;
            }
        }
    </style>
</head>
<body>
    <!-- Header ultra compacto -->
    <header class="header">
        <div>
            <h1 class="name">Mohamed Chennani</h1>
            <p class="title">Técnico Informático & Especialista en Sistemas</p>
        </div>
        <div class="contact">
            <div>hi@mohamedch.com</div>
            <div>642 074 283</div>
            <div>Alaquas, Valencia, Spain</div>
            <div>https://mohamedch.com</div>
        </div>
    </header>

    <!-- Resumen ultra compacto -->
    <section class="section">
        <h2 class="section-title">Resumen Profesional</h2>
        <p class="summary">
            Técnico informático con más de 10 años de experiencia práctica especializado en administración de sistemas Linux, 
            redes, Cloudflare, y soluciones de streaming/IPTV. Experiencia en soporte técnico remoto y presencial, 
            administración de servidores, desarrollo web y automatización. Hablo español, inglés, francés y árabe. 
            Trabajo de forma independiente como freelance resolviendo problemas técnicos reales para clientes en España.
        </p>
    </section>

    <!-- Experiencia ultra compacta -->
    <section class="section">
        <h2 class="section-title">Experiencia Laboral</h2>
        <div class="exp-item">
            <div class="exp-header">
                <div>
                    <h3 class="exp-role">Técnico Informático Freelance / Soporte IT</h3>
                    <p class="exp-company">Autónomo</p>
                </div>
                <span class="exp-period">2020 — Actualidad</span>
            </div>
            <p class="exp-desc">
                • Soporte técnico a clientes en España (remoto y presencial)<br>
                • Administración de servidores Linux (Ubuntu, Debian, CentOS)<br>
                • Configuración y optimización de Cloudflare (DNS, CDN, Workers)<br>
                • Implementación de soluciones de streaming/IPTV (HLS, SRS, FFmpeg)<br>
                • Desarrollo y mantenimiento de sitios web (WordPress, Astro)<br>
                • Reparación de hardware y resolución de problemas de red<br>
                • Automatización de procesos con Python, Bash y GitHub Actions
            </p>
        </div>
        <div class="exp-item">
            <div class="exp-header">
                <div>
                    <h3 class="exp-role">Técnico Informático</h3>
                    <p class="exp-company">Tienda propia</p>
                </div>
                <span class="exp-period">2013 — 2019</span>
            </div>
            <p class="exp-desc">
                • Reparación de ordenadores y dispositivos móviles<br>
                • Montaje y venta de equipos informáticos personalizados<br>
                • Instalación y configuración de software y sistemas operativos<br>
                • Configuración de redes locales (LAN/Wi-Fi)<br>
                • Atención al cliente y asesoramiento técnico<br>
                • Gestión de inventario y proveedores
            </p>
        </div>
    </section>

    <!-- Habilidades ultra compactas (solo 6 principales) -->
    <section class="section">
        <h2 class="section-title">Habilidades Técnicas</h2>
        <div class="skills-grid">
            <div class="skill-item"><div class="skill-name"><span>Linux / Unix</span><span>85%</span></div><div class="skill-bar"><div class="skill-fill" style="width:85%"></div></div></div>
            <div class="skill-item"><div class="skill-name"><span>Redes & Networking</span><span>80%</span></div><div class="skill-bar"><div class="skill-fill" style="width:80%"></div></div></div>
            <div class="skill-item"><div class="skill-name"><span>Cloudflare / DNS</span><span>82%</span></div><div class="skill-bar"><div class="skill-fill" style="width:82%"></div></div></div>
            <div class="skill-item"><div class="skill-name"><span>Nginx / Apache</span><span>78%</span></div><div class="skill-bar"><div class="skill-fill" style="width:78%"></div></div></div>
            <div class="skill-item"><div class="skill-name"><span>Streaming / IPTV</span><span>83%</span></div><div class="skill-bar"><div class="skill-fill" style="width:83%"></div></div></div>
            <div class="skill-item"><div class="skill-name"><span>Soporte HW & SW</span><span>88%</span></div><div class="skill-bar"><div class="skill-fill" style="width:88%"></div></div></div>
        </div>
    </section>

    <!-- Proyectos ultra compactos (solo 2) -->
    <section class="section">
        <h2 class="section-title">Proyectos Destacados</h2>
        <div class="project-item">
            <h3 class="project-title">yesmatch.live</h3>
            <p class="project-category">Plataforma de Streaming Deportivo · 2024</p>
            <p class="project-desc">Plataforma de streaming deportivo en árabe con infraestructura de 4 servidores, Cloudflare Workers, y sistema de subdominios hash para protección DMCA.</p>
        </div>
        <div class="project-item">
            <h3 class="project-title">pinturasmoha.es</h3>
            <p class="project-category">Sitio Web para Negocio Local · 2024</p>
            <p class="project-desc">Sitio web completo para pintor profesional con blog automatizado diario usando GitHub Actions y Gemini API.</p>
        </div>
    </section>

    <!-- Idiomas ultra compactos -->
    <section class="section">
        <h2 class="section-title">Idiomas</h2>
        <div class="langs">
            <div class="lang-item"><span class="lang-name">Árabe</span><span class="lang-level">Nativo</span></div>
            <div class="lang-item"><span class="lang-name">Inglés</span><span class="lang-level">Avanzado</span></div>
            <div class="lang-item"><span class="lang-name">Español</span><span class="lang-level">Intermedio</span></div>
            <div class="lang-item"><span class="lang-name">Francés</span><span class="lang-level">Intermedio</span></div>
        </div>
    </section>

    <!-- Certificaciones ultra compactas (solo 2) -->
    <section class="section">
        <h2 class="section-title">Certificaciones</h2>
        <div class="cert-item">
            <div><h3 class="cert-title">Mantenimiento de dispositivos tecnológicos</h3><p class="cert-org">Agencia Digital de Andalucía</p></div>
            <span class="cert-year">2025</span>
        </div>
        <div class="cert-item">
            <div><h3 class="cert-title">Aspectos básicos de la asistencia técnica</h3><p class="cert-org">Google / Coursera</p></div>
            <span class="cert-year">2023</span>
        </div>
    </section>

    <!-- Educación ultra compacta -->
    <section class="section">
        <h2 class="section-title">Educación</h2>
        <div class="edu-item">
            <div class="edu-header">
                <h3 class="edu-title">Formación Profesional en Informática</h3>
                <span class="exp-period">Grado Medio</span>
            </div>
            <p class="edu-org">OFPPT</p>
            <p class="edu-loc">Khouribga, Marruecos · 1 año cursado</p>
        </div>
    </section>

    <!-- Footer ultra pequeño -->
    <div class="footer">
        <p>Última actualización: 13 de abril de 2026</p>
        <p>CV disponible en línea en: https://mohamedch.com/cv</p>
    </div>
</body>
</html>"""
    
    return html

def main():
    # Create the HTML file
    html_content = create_pdf_html()
    
    # Save HTML file
    html_path = "public/cv-ultra-compact.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Created {html_path}")
    
    # Try to convert to PDF using available tools
    print("\nTrying to convert to PDF...")
    
    # Try using weasyprint if available
    try:
        import weasyprint
        pdf_path = "public/cv-1page.pdf"
        weasyprint.HTML(string=html_content).write_pdf(pdf_path)
        print(f"✓ Created PDF with weasyprint: {pdf_path}")
        return 0
    except ImportError:
        print("✗ weasyprint not available")
    
    # Try using xhtml2pdf if available
    try:
        from xhtml2pdf import pisa
        pdf_path = "public/cv-1page.pdf"
        with open(pdf_path, "wb") as f:
            pisa.CreatePDF(html_content, dest=f)
        print(f"✓ Created PDF with xhtml2pdf: {pdf_path}")
        return 0
    except ImportError:
        print("✗ xhtml2pdf not available")
    
    # Try using wkhtmltopdf if available
    import subprocess
    try:
        result = subprocess.run(["which", "wkhtmltopdf"], capture_output=True, text=True)
        if result.returncode == 0:
            pdf_path = "public/cv-1page.pdf"
            subprocess.run(["wkhtmltop            subprocess.run(["wkhtmltopdf", "--page-size", "A4", "--margin-top", "8mm", "--margin-right", "12mm", "--margin-bottom", "8mm", "--margin-left", "12mm", html_path, pdf_path])
            print(f"✓ Created PDF with wkhtmltopdf: {pdf_path}")
            return 0
    except Exception as e:
        print(f"✗ wkhtmltopdf error: {e}")
    
    print("\n⚠️  Could not generate PDF automatically.")
    print("Please install one of:")
    print("  - weasyprint: pip install weasyprint")
    print("  - xhtml2pdf: pip install xhtml2pdf")
    print("  - wkhtmltopdf: sudo apt install wkhtmltopdf")
    print("\nFor now, you can:")
    print(f"  1. Open {html_path} in browser")
    print("  2. Print → Save as PDF")
    print("  3. Set margins to 'None'")
    print("  4. Save as cv-1page.pdf")
    
    return 1

if __name__ == "__main__":
    sys.exit(main())
