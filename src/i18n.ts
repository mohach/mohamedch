export type Lang = 'en' | 'es';

/* ── SHARED DATA ─────────────────────────────────────────────── */
export const personal = {
  name:     'Mohamed Chennani',
  email:    'hi@mohamedch.com',
  phone:    '641 891 505',
  location: 'Alaquas, Valencia, Spain',
  website:  'https://mohamedch.com',
};

export const socials = [
  { label: 'GitHub',   handle: '@mohamedch',    href: 'https://github.com/mohamedch' },
  { label: 'LinkedIn', handle: 'mohamedch',      href: 'https://linkedin.com/in/mohamedch' },
  { label: 'X',        handle: '@mohamedch',     href: 'https://x.com/mohamedch' },
];

export const skills = [
  { name: 'Linux',       pct: 85 },
  { name: 'Networking',  pct: 80 },
  { name: 'HTML / CSS',  pct: 78 },
  { name: 'WordPress',   pct: 75 },
  { name: 'Cloudflare',  pct: 80 },
  { name: 'Streaming / IPTV', pct: 82 },
  { name: 'Windows Server',   pct: 75 },
  { name: 'Coding',           pct: 60 },
];

export const langs = [
  { name_en: 'Spanish', name_es: 'Español', pct: 100 },
  { name_en: 'English', name_es: 'Inglés',  pct: 75  },
  { name_en: 'French',  name_es: 'Francés', pct: 65  },
  { name_en: 'Arabic',  name_es: 'Árabe',   pct: 100 },
];

export const certs = [
  {
    title: 'Technical Support Fundamentals',
    org:   'Google / Coursera',
    year:  '2023',
  },
  {
    title: 'Introduction to HTML5',
    org:   'University of Michigan / Coursera',
    year:  '2023',
  },
  {
    title: 'LFS101x.2: Introduction to Linux',
    org:   'Linux Foundation / edX',
    year:  '2016',
  },
];

/* ── PROJECTS — bilingual ────────────────────────────────────── */
export const projects = {
  en: [
    {
      slug:     'freelance-it-support',
      title:    'Freelance IT Support & Infrastructure',
      category: 'Freelance · 2020–Present',
      date:     '2020 — Present',
      readTime: '5 min read',
      summary:  'Remote and on-site technical support for clients across Spain — servers, Linux, WordPress, networking, Cloudflare, and IPTV/streaming solutions.',
      detail:   'Working independently since 2020, I provide end-to-end IT support to individuals and small businesses: Linux server setup and hardening, web server configuration (Apache/Nginx), WordPress deployment and maintenance, Cloudflare DNS/CDN management, IPTV streaming infrastructure, and hardware repair. Every engagement is different — I adapt to the client\'s environment and budget.',
      tags:     ['Linux', 'Networking', 'WordPress', 'Cloudflare', 'Streaming'],
      github:   null,
      live:     'https://mohamedch.com',
      metrics:  [{ v:'10+', l:'Years exp.' }, { v:'100+', l:'Clients served' }, { v:'4', l:'Languages' }],
      outcome:  'Long-term clients across Spain for server management, web maintenance, and streaming infrastructure.',
    },
    {
      slug:     'iptv-streaming-setup',
      title:    'IPTV & Streaming Infrastructure',
      category: 'Technical Project · 2021',
      date:     '2021',
      readTime: '4 min read',
      summary:  'Design and deployment of end-to-end IPTV and live streaming solutions — from server configuration to CDN delivery.',
      detail:   'Designed and deployed complete IPTV and streaming pipelines: VPS provisioning, FFmpeg encoding, SRS/Oryx RTMP ingest, HLS packaging, and Cloudflare CDN distribution. Configured residential SOCKS5 proxies for source reliability. The result is a stable, low-latency stream delivery architecture serving multiple concurrent viewers.',
      tags:     ['FFmpeg', 'Cloudflare', 'Linux', 'HLS', 'Networking'],
      github:   null,
      live:     null,
      metrics:  [{ v:'<2s', l:'Stream latency' }, { v:'99%', l:'Uptime' }, { v:'CDN', l:'Cloudflare' }],
      outcome:  'Stable multi-viewer streaming architecture with Cloudflare CDN and automated failover.',
    },
    {
      slug:     'linux-server-admin',
      title:    'Linux Server Administration',
      category: 'Ongoing · 2020–Present',
      date:     '2020 — Present',
      readTime: '4 min read',
      summary:  'Setup, hardening, and ongoing administration of Linux web servers for clients — Apache, Nginx, SSH, firewall, and monitoring.',
      detail:   'I manage Linux servers (Ubuntu/Debian/CentOS) for clients: initial provisioning, SSH hardening, firewall rules (UFW/iptables), Apache/Nginx virtualhost configuration, SSL/TLS via Let\'s Encrypt, cron jobs, log monitoring, and regular backups. I also handle WordPress LAMP/LEMP stack deployments and performance tuning.',
      tags:     ['Linux', 'Apache', 'Nginx', 'SSH', 'WordPress'],
      github:   null,
      live:     null,
      metrics:  [{ v:'Ubuntu', l:'Primary distro' }, { v:'99.9%', l:'Uptime' }, { v:'SSL', l:'All servers' }],
      outcome:  'Clients report zero unplanned downtime and faster page loads after server optimisations.',
    },
    {
      slug:     'hardware-repair-shop',
      title:    'Computer & Mobile Repair Shop',
      category: 'Business · 2013–2019',
      date:     '2013 — 2019',
      readTime: '3 min read',
      summary:  'Ran a full-service computer and mobile repair business in Morocco — hardware, software, networking, and sales.',
      detail:   'Operated my own tech shop in Khouribga, Morocco for 6 years. Services included PC and mobile hardware diagnosis and repair, component assembly and sales, OS installation and configuration, local network setup for homes and small businesses, and customer tech support. Managed all operations independently.',
      tags:     ['Hardware', 'Windows', 'Networking', 'Mobile'],
      github:   null,
      live:     null,
      metrics:  [{ v:'6', l:'Years running' }, { v:'500+', l:'Repairs' }, { v:'Solo', l:'Operation' }],
      outcome:  'Built a loyal customer base in Khouribga with word-of-mouth referrals over 6 years.',
    },
  ],
  es: [
    {
      slug:     'freelance-it-support',
      title:    'Soporte IT y Sistemas Freelance',
      category: 'Freelance · 2020–Actualidad',
      date:     '2020 — Actualidad',
      readTime: '5 min de lectura',
      summary:  'Soporte técnico remoto y presencial para clientes en España — servidores, Linux, WordPress, redes, Cloudflare y streaming/IPTV.',
      detail:   'Desde 2020 trabajo de forma independiente ofreciendo soporte IT completo a particulares y pequeñas empresas: configuración y hardening de servidores Linux, Apache/Nginx, WordPress, gestión de DNS/CDN con Cloudflare, infraestructura de streaming IPTV y reparación de equipos. Cada proyecto es diferente — me adapto al entorno y presupuesto del cliente.',
      tags:     ['Linux', 'Redes', 'WordPress', 'Cloudflare', 'Streaming'],
      github:   null,
      live:     'https://mohamedch.com',
      metrics:  [{ v:'10+', l:'Años exp.' }, { v:'100+', l:'Clientes' }, { v:'4', l:'Idiomas' }],
      outcome:  'Clientes recurrentes en España para gestión de servidores, mantenimiento web e infraestructura de streaming.',
    },
    {
      slug:     'iptv-streaming-setup',
      title:    'Infraestructura IPTV y Streaming',
      category: 'Proyecto técnico · 2021',
      date:     '2021',
      readTime: '4 min de lectura',
      summary:  'Diseño y despliegue de soluciones completas de IPTV y streaming en vivo — desde la configuración del servidor hasta la distribución por CDN.',
      detail:   'Diseñé y desplegué pipelines completos de IPTV y streaming: aprovisionamiento de VPS, codificación con FFmpeg, ingest RTMP con SRS/Oryx, empaquetado HLS y distribución con Cloudflare CDN. Configuración de proxies SOCKS5 residenciales para fiabilidad de fuente. Resultado: arquitectura estable y de baja latencia para múltiples espectadores simultáneos.',
      tags:     ['FFmpeg', 'Cloudflare', 'Linux', 'HLS', 'Redes'],
      github:   null,
      live:     null,
      metrics:  [{ v:'<2s', l:'Latencia' }, { v:'99%', l:'Uptime' }, { v:'CDN', l:'Cloudflare' }],
      outcome:  'Arquitectura de streaming multi-espectador estable con CDN Cloudflare y failover automático.',
    },
    {
      slug:     'linux-server-admin',
      title:    'Administración de Servidores Linux',
      category: 'Continuo · 2020–Actualidad',
      date:     '2020 — Actualidad',
      readTime: '4 min de lectura',
      summary:  'Configuración, hardening y administración continua de servidores web Linux para clientes — Apache, Nginx, SSH, firewall y monitorización.',
      detail:   'Gestiono servidores Linux (Ubuntu/Debian/CentOS) para clientes: aprovisionamiento inicial, hardening SSH, reglas de firewall (UFW/iptables), virtualhost Apache/Nginx, SSL/TLS con Let\'s Encrypt, cron jobs, monitorización de logs y copias de seguridad. También despliegues WordPress en LAMP/LEMP y optimización de rendimiento.',
      tags:     ['Linux', 'Apache', 'Nginx', 'SSH', 'WordPress'],
      github:   null,
      live:     null,
      metrics:  [{ v:'Ubuntu', l:'Distro' }, { v:'99.9%', l:'Uptime' }, { v:'SSL', l:'Todos' }],
      outcome:  'Los clientes reportan cero caídas no planificadas y páginas más rápidas tras las optimizaciones.',
    },
    {
      slug:     'hardware-repair-shop',
      title:    'Tienda de Reparación de Equipos',
      category: 'Negocio propio · 2013–2019',
      date:     '2013 — 2019',
      readTime: '3 min de lectura',
      summary:  'Gestión de una tienda de reparación de ordenadores y móviles en Marruecos — hardware, software, redes y venta.',
      detail:   'Gestioné mi propia tienda de tecnología en Khouribga, Marruecos durante 6 años. Servicios: diagnóstico y reparación de hardware de PC y móviles, montaje y venta de componentes, instalación y configuración de sistemas operativos, configuración de redes domésticas y empresariales, y atención al cliente. Gestión completamente independiente.',
      tags:     ['Hardware', 'Windows', 'Redes', 'Móviles'],
      github:   null,
      live:     null,
      metrics:  [{ v:'6', l:'Años' }, { v:'500+', l:'Reparaciones' }, { v:'Solo', l:'Gestión' }],
      outcome:  'Base de clientes fiel en Khouribga con referencias boca a boca durante 6 años.',
    },
  ],
};

/* ── UI STRINGS — bilingual ──────────────────────────────────── */
export const ui = {
  en: {
    langSwitch: 'ES',
    nav: { about:'About', work:'Work', blog:'Blog', contact:'Contact' },
    footer: { role: 'IT Technician · Alaquas, Valencia', built: 'Built with Astro.', openWork: 'Open to work →' },
    hero: {
      available: 'Available for work',
      title1: 'Mohamed',
      title2: 'Chennani',
      role: 'IT Technician & Systems Specialist',
      desc: 'Over 10 years of experience in technical support, hardware repair, networking, and Linux/Windows systems administration. Specialised in web servers, <strong>Cloudflare</strong>, and <strong>streaming/IPTV</strong> solutions.',
      cta1: 'View work', cta2: 'Contact me',
    },
    about: {
      label: 'About', title: 'Who I am',
      p1: 'IT technician with 10+ years of hands-on experience — from running my own repair shop in Morocco to managing Linux servers and streaming infrastructure for clients across Spain.',
      p2: 'I work independently as a freelancer, solving real problems: servers that go down, networks that don\'t connect, streams that won\'t play. I speak Spanish, English, French, and Arabic, which helps me work with a wide range of clients.',
      stats: [
        { n:'10+', l:'Years exp.' },
        { n:'4',   l:'Languages'  },
        { n:'100%', l:'Remote ready' },
      ],
    },
    exp: {
      label: 'Experience', title: "Where I've worked",
      now: 'Now',
      items: [
        { role:'IT Technician Freelance / IT Support', company:'Self-employed', location:'Spain', period:'2020 — Present', desc:'Client support, servers, Linux/web, WordPress, networking, Cloudflare, streaming/IPTV, hardware repair.', current:true },
        { role:'IT Technician',                        company:'Own Shop',      location:'Khouribga, Morocco', period:'2013 — 2019', desc:'PC and mobile repair, hardware assembly and sales, software installation, networking and customer care.', current:false },
      ],
    },
    edu: {
      label: 'Education',
      items: [
        { title:'Vocational Training in IT', org:'OFPPT', location:'Khouribga, Morocco', level:'Intermediate', note:'1 year completed' },
        { title:'Baccalaureate — PC track', org:'Ibn Abdoune High School', location:'Khouribga, Morocco', level:'High School', note:'1st year completed' },
      ],
    },
    certs: { label:'Certifications' },
    skills: { label:'Skills', title:'What I work with' },
    langs: { label:'Languages' },
    work: {
      label:'Work', title:'Projects & experience',
      sub:'Real work — from streaming infrastructure to server administration and client IT support.',
      readMore:'Read more →', github:'GitHub', live:'Live', seeAll:'All projects →',
    },
    blog: {
      label:'Writing', title:'Articles & notes',
      sub:'Technical notes on Linux, networking, Cloudflare, streaming, and web administration.',
    },
    contact: {
      label:'Contact', title:"Let's talk",
      sub:'Available for freelance projects, consulting, and long-term IT support contracts. I reply within 24 hours.',
      avail:'Available for work',
      loc:'Alaquas, Valencia', tz:'CET (UTC+1)', avail_h:'Flexible', resp:'< 24h',
      fieldName:'Name', fieldEmail:'Email', fieldType:'Project type', fieldMsg:'Message',
      phName:'Your name', phEmail:'you@email.com', phMsg:'Tell me about your project or problem…',
      types:['IT Support / Helpdesk','Server Administration','Web / WordPress','Streaming / IPTV','Cloudflare Setup','Other'],
      send:'Send message', orEmail:'or email:', sent:"Message sent — I'll reply soon!",
      findMe:'Find me on',
      faq: {
        label:'Common questions',
        items:[
          { q:'What services do you offer?',   a:'IT support, Linux server admin, WordPress, Cloudflare setup, networking, hardware repair, and streaming/IPTV infrastructure.' },
          { q:'Do you work remotely?',         a:'Yes, most of my work is remote via SSH, RDP, and TeamViewer. I can also travel within Valencia for on-site visits.' },
          { q:'How much do you charge?',       a:'Depends on the service. I offer hourly rates and monthly maintenance contracts. Contact me for a quote.' },
        ],
      },
    },
    notFound: { title:'Page not found', desc:"This page doesn't exist.", back:'Go home' },
  },

  es: {
    langSwitch: 'EN',
    nav: { about:'Sobre mí', work:'Proyectos', blog:'Blog', contact:'Contacto' },
    footer: { role: 'Técnico Informático · Alaquas, Valencia', built: 'Construido con Astro.', openWork: 'Disponible para trabajar →' },
    hero: {
      available: 'Disponible para trabajar',
      title1: 'Mohamed',
      title2: 'Chennani',
      role: 'Técnico Informático y Especialista en Sistemas',
      desc: 'Más de 10 años de experiencia en soporte técnico, reparación de hardware, redes y administración de sistemas Linux y Windows. Especializado en servidores web, <strong>Cloudflare</strong> y soluciones de <strong>streaming/IPTV</strong>.',
      cta1: 'Ver proyectos', cta2: 'Contactar',
    },
    about: {
      label:'Sobre mí', title:'Quién soy',
      p1: 'Técnico informático con más de 10 años de experiencia práctica — desde gestionar mi propia tienda de reparación en Marruecos hasta administrar servidores Linux e infraestructura de streaming para clientes en España.',
      p2: 'Trabajo de forma independiente como freelance, resolviendo problemas reales: servidores que caen, redes que no conectan, streams que no reproducen. Hablo español, inglés, francés y árabe, lo que me permite trabajar con una amplia variedad de clientes.',
      stats: [
        { n:'10+', l:'Años exp.'   },
        { n:'4',   l:'Idiomas'     },
        { n:'100%', l:'Remoto'     },
      ],
    },
    exp: {
      label:'Experiencia', title:'Dónde he trabajado',
      now:'Actual',
      items: [
        { role:'Técnico Informático Freelance / Soporte IT', company:'Autónomo', location:'España', period:'2020 — Actualidad', desc:'Soporte a clientes, servidores, Linux/web, WordPress, redes, Cloudflare, streaming/IPTV, reparación de equipos.', current:true },
        { role:'Técnico Informático',                        company:'Tienda propia', location:'Khouribga, Marruecos', period:'2013 — 2019', desc:'Reparación de ordenadores y móviles, montaje y venta de equipos, instalación de software, redes y atención al cliente.', current:false },
      ],
    },
    edu: {
      label:'Educación',
      items: [
        { title:'Formación Profesional en Informática', org:'OFPPT', location:'Khouribga, Marruecos', level:'Grado Medio', note:'1 año cursado' },
        { title:'Bachillerato — rama PC',               org:'Ibn Abdoune High School', location:'Khouribga, Marruecos', level:'Bachillerato', note:'1º curso cursado' },
      ],
    },
    certs: { label:'Certificaciones' },
    skills: { label:'Competencias', title:'Tecnologías que uso' },
    langs: { label:'Idiomas' },
    work: {
      label:'Proyectos', title:'Proyectos y experiencia',
      sub:'Trabajo real — desde infraestructura de streaming hasta administración de servidores y soporte IT para clientes.',
      readMore:'Leer más →', github:'GitHub', live:'Ver en vivo', seeAll:'Todos los proyectos →',
    },
    blog: {
      label:'Escritura', title:'Artículos y notas',
      sub:'Notas técnicas sobre Linux, redes, Cloudflare, streaming y administración web.',
    },
    contact: {
      label:'Contacto', title:'Hablemos',
      sub:'Disponible para proyectos freelance, consultoría y contratos de soporte IT a largo plazo. Respondo en menos de 24 horas.',
      avail:'Disponible para trabajar',
      loc:'Alaquas, Valencia', tz:'CET (UTC+1)', avail_h:'Flexible', resp:'< 24h',
      fieldName:'Nombre', fieldEmail:'Email', fieldType:'Tipo de servicio', fieldMsg:'Mensaje',
      phName:'Tu nombre', phEmail:'tu@email.com', phMsg:'Cuéntame tu proyecto o problema…',
      types:['Soporte IT / Helpdesk','Administración de servidores','Web / WordPress','Streaming / IPTV','Cloudflare','Otro'],
      send:'Enviar mensaje', orEmail:'o escríbeme a:', sent:'¡Mensaje enviado — te respondo pronto!',
      findMe:'Encuéntrame en',
      faq: {
        label:'Preguntas frecuentes',
        items:[
          { q:'¿Qué servicios ofreces?',        a:'Soporte IT, administración de servidores Linux, WordPress, Cloudflare, redes, reparación de hardware e infraestructura de streaming/IPTV.' },
          { q:'¿Trabajas en remoto?',            a:'Sí, la mayoría de mi trabajo es remoto via SSH, RDP y TeamViewer. También puedo desplazarme por Valencia para visitas presenciales.' },
          { q:'¿Cuánto cobras?',                 a:'Depende del servicio. Ofrezco tarifas por hora y contratos de mantenimiento mensual. Contáctame para un presupuesto.' },
        ],
      },
    },
    notFound: { title:'Página no encontrada', desc:'Esta página no existe.', back:'Ir al inicio' },
  },
} as const;

export type UI = typeof ui.en;
