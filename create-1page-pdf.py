#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.colors import Color, black, blue, darkblue, grey
import os

def create_pdf():
    # Create PDF document
    pdf_path = "public/cv-1page.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        topMargin=10*mm,
        bottomMargin=10*mm,
        leftMargin=12*mm,
        rightMargin=12*mm
    )
    
    # Custom styles
    styles = getSampleStyleSheet()
    
    # Title style
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=Color(0.173, 0.322, 0.447),  # #2c5282
        spaceAfter=2*mm,
        alignment=TA_LEFT
    )
    
    # Subtitle style
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=Color(0.298, 0.337, 0.408),  # #4a5568
        spaceAfter=4*mm,
        alignment=TA_LEFT
    )
    
    # Contact style
    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontSize=8,
        textColor=black,
        alignment=TA_RIGHT,
        spaceAfter=6*mm
    )
    
    # Section title style
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=10,
        textColor=Color(0.173, 0.322, 0.447),  # #2c5282
        spaceBefore=4*mm,
        spaceAfter=2*mm,
        alignment=TA_LEFT
    )
    
    # Normal text style
    normal_style = ParagraphStyle(
        'NormalCompact',
        parent=styles['Normal'],
        fontSize=9,
        textColor=black,
        spaceAfter=1*mm,
        alignment=TA_LEFT,
        leading=11
    )
    
    # Bullet style
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontSize=8.5,
        textColor=Color(0.298, 0.337, 0.408),  # #4a5568
        spaceAfter=0.5*mm,
        alignment=TA_LEFT,
        leftIndent=10,
        leading=10
    )
    
    # Small style
    small_style = ParagraphStyle(
        'Small',
        parent=styles['Normal'],
        fontSize=8,
        textColor=Color(0.443, 0.502, 0.588),  # #718096
        spaceAfter=0.5*mm,
        alignment=TA_LEFT,
        leading=9
    )
    
    # Build story
    story = []
    
    # Header
    story.append(Paragraph("Mohamed Chennani", title_style))
    story.append(Paragraph("Técnico Informático & Especialista en Sistemas", subtitle_style))
    
    # Contact info (right aligned)
    contact_text = """hi@mohamedch.com<br/>
    642 074 283<br/>
    Alaquas, Valencia, Spain<br/>
    https://mohamedch.com"""
    story.append(Paragraph(contact_text, contact_style))
    
    # Professional Summary
    story.append(Paragraph("RESUMEN PROFESIONAL", section_style))
    summary_text = """Técnico informático con más de 10 años de experiencia práctica especializado en administración de sistemas Linux, redes, Cloudflare, y soluciones de streaming/IPTV. Experiencia en soporte técnico remoto y presencial, administración de servidores, desarrollo web y automatización. Hablo español, inglés, francés y árabe. Trabajo de forma independiente como freelance resolviendo problemas técnicos reales para clientes en España."""
    story.append(Paragraph(summary_text, normal_style))
    
    # Work Experience
    story.append(Paragraph("EXPERIENCIA LABORAL", section_style))
    
    # Job 1
    story.append(Paragraph("<b>Técnico Informático Freelance / Soporte IT</b> · Autónomo · 2020 — Actualidad", normal_style))
    story.append(Paragraph("• Soporte técnico a clientes en España (remoto y presencial)", bullet_style))
    story.append(Paragraph("• Administración de servidores Linux (Ubuntu, Debian, CentOS)", bullet_style))
    story.append(Paragraph("• Configuración y optimización de Cloudflare (DNS, CDN, Workers)", bullet_style))
    story.append(Paragraph("• Implementación de soluciones de streaming/IPTV (HLS, SRS, FFmpeg)", bullet_style))
    story.append(Paragraph("• Desarrollo y mantenimiento de sitios web (WordPress, Astro)", bullet_style))
    story.append(Paragraph("• Reparación de hardware y resolución de problemas de red", bullet_style))
    story.append(Paragraph("• Automatización de procesos con Python, Bash y GitHub Actions", bullet_style))
    
    story.append(Spacer(1, 2*mm))
    
    # Job 2
    story.append(Paragraph("<b>Técnico Informático</b> · Tienda propia · 2013 — 2019", normal_style))
    story.append(Paragraph("• Reparación de ordenadores y dispositivos móviles", bullet_style))
    story.append(Paragraph("• Montaje y venta de equipos informáticos personalizados", bullet_style))
    story.append(Paragraph("• Instalación y configuración de software y sistemas operativos", bullet_style))
    story.append(Paragraph("• Configuración de redes locales (LAN/Wi-Fi)", bullet_style))
    story.append(Paragraph("• Atención al cliente y asesoramiento técnico", bullet_style))
    story.append(Paragraph("• Gestión de inventario y proveedores", bullet_style))
    
    # Technical Skills
    story.append(Paragraph("HABILIDADES TÉCNICAS", section_style))
    skills_text = """Linux/Unix (85%) · Redes & Networking (80%) · Cloudflare/DNS (82%)<br/>
    Nginx/Apache (78%) · Streaming/IPTV (83%) · Soporte HW/SW (88%)"""
    story.append(Paragraph(skills_text, normal_style))
    
    # Projects
    story.append(Paragraph("PROYECTOS DESTACADOS", section_style))
    story.append(Paragraph("<b>yesmatch.live</b> · Plataforma de Streaming Deportivo · 2024", normal_style))
    story.append(Paragraph("Plataforma de streaming deportivo en árabe con infraestructura de 4 servidores, Cloudflare Workers, y sistema de subdominios hash para protección DMCA.", small_style))
    
    story.append(Spacer(1, 1*mm))
    
    story.append(Paragraph("<b>pinturasmoha.es</b> · Sitio Web para Negocio Local · 2024", normal_style))
    story.append(Paragraph("Sitio web completo para pintor profesional con blog automatizado diario usando GitHub Actions y Gemini API.", small_style))
    
    # Languages
    story.append(Paragraph("IDIOMAS", section_style))
    langs_text = """Árabe (Nativo) · Inglés (Avanzado) · Español (Intermedio) · Francés (Intermedio)"""
    story.append(Paragraph(langs_text, normal_style))
    
    # Certifications
    story.append(Paragraph("CERTIFICACIONES", section_style))
    story.append(Paragraph("<b>Mantenimiento de dispositivos tecnológicos</b> · Agencia Digital de Andalucía · 2025", normal_style))
    story.append(Paragraph("<b>Aspectos básicos de la asistencia técnica</b> · Google / Coursera · 2023", normal_style))
    
    # Education
    story.append(Paragraph("EDUCACIÓN", section_style))
    story.append(Paragraph("<b>Formación Profesional en Informática</b> · Grado Medio · OFPPT", normal_style))
    story.append(Paragraph("Khouribga, Marruecos · 1 año cursado", small_style))
    
    # Footer
    story.append(Spacer(1, 4*mm))
    footer_text = """<font size="7">Última actualización: 13 de abril de 2026<br/>
    CV disponible en línea en: https://mohamedch.com/cv</font>"""
    story.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=styles['Normal'], alignment=TA_CENTER)))
    
    # Build PDF
    doc.build(story)
    print(f"✓ Created 1-page PDF: {pdf_path}")
    
    # Replace the current cv-clean.pdf
    os.system(f"cp {pdf_path} public/cv-clean.pdf")
    print(f"✓ Replaced public/cv-clean.pdf with 1-page version")

if __name__ == "__main__":
    # Check if reportlab is installed
    try:
        create_pdf()
    except ImportError:
        print("Error: reportlab not installed.")
        print("Install with: pip install reportlab")
        print("\nFor now, you can:")
        print("1. Open public/cv-ultra-compact.html in browser")
        print("2. Print → Save as PDF")
        print("3. Set margins to 'None'")
        print("4. Save as public/cv-clean.pdf")