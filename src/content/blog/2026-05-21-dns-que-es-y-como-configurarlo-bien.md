---
title: "DNS: qué es y cómo configurarlo bien"
excerpt: "Aprende qué es el DNS, cómo funciona y los pasos clave para configurarlo correctamente en tus dispositivos y redes."
date: "2026-05-21"
lang: "es"
slug: "dns-que-es-y-como-configurarlo-bien"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

No todo el mundo sabe que cada vez que escribes una URL en tu navegador, hay un servicio invisible que traduce ese nombre a una dirección IP. Ese servicio es el DNS (Domain Name System), y aunque parezca técnico, configurarlo bien puede mejorar tu velocidad de navegación, seguridad y evitar bloqueos. Vamos a verlo de forma práctica.

## ¿Qué es el DNS y por qué deberías cambiarlo?

El DNS funciona como la agenda de contactos de Internet. Cuando pones `mohamedch.com`, tu equipo consulta un servidor DNS para saber qué IP tiene asignada. Por defecto, tu router o proveedor te asigna unos servidores DNS que no siempre son los más rápidos ni los más seguros.

Cambiar a DNS públicos como los de Cloudflare (`1.1.1.1`) o Google (`8.8.8.8`) suele traducirse en menos latencia y, en muchos casos, evita bloqueos impuestos por operadoras. Además, algunos ofrecen filtrado contra malware o contenido adulto.

## Cómo cambiar los DNS en tu sistema

### En Linux (NetworkManager)

Si usas Ubuntu, Debian o derivados con NetworkManager, edita la conexión desde terminal:

```bash
nmcli con mod "MiConexion" ipv4.dns "1.1.1.1 8.8.8.8"
nmcli con mod "MiConexion" ipv4.ignore-auto-dns yes
nmcli con up "MiConexion"
```

Para sistemas con systemd-resolved, edita `/etc/systemd/resolved.conf`:

```
[Resolve]
DNS=1.1.1.1 8.8.8.8
```

Luego reinicia el servicio: `sudo systemctl restart systemd-resolved`.

### En Windows

Ve a *Panel de control > Centro de redes y recursos compartidos > Cambiar configuración del adaptador*. Haz clic derecho en tu conexión, *Propiedades*, selecciona *Protocolo de Internet versión 4 (TCP/IPv4)* y marca *Usar las siguientes direcciones de servidor DNS*. Pon `1.1.1.1` y `1.0.0.1` como alternativa.

### En el router

Accede a la configuración del router (normalmente `192.168.1.1`), busca la sección WAN o Internet y cambia los servidores DNS. Esto aplica a todos los dispositivos de la red sin tocarlos uno por uno.

## Verificar que el cambio funciona

Después de aplicar los cambios, abre un terminal y ejecuta:

```bash
nslookup google.com
```

O más moderno:

```bash
dig google.com +short
```

Si ves como respuesta la IP de Google y la línea `Server` apunta a `1.1.1.1`, todo correcto. Para comprobar la velocidad real, usa `dig` con tiempos:

```bash
dig google.com | grep "Query time"
```

## DNS recomendados y cuándo usarlos

- **Cloudflare 1.1.1.1**: Máxima privacidad (no guardan logs). Ideal para uso diario.
- **Google 8.8.8.8**: Muy rápido y fiable, aunque con políticas de datos menos estrictas.
- **Quad9 9.9.9.9**: Bloquea dominios maliciosos y malware. Perfecto para redes familiares o empresas pequeñas.
- **OpenDNS 208.67.222.222**: Permite filtrado por categorías si te registras.

Si necesitas evitar bloqueos geográficos o de operadora, prueba con DNS de Cloudflare o Google primero. Si buscas seguridad extra, Quad9 es una opción sólida.

## Conclusión

Configurar bien el DNS es un cambio pequeño que puede notarse en el día a día: páginas que cargan más rápido, menos anuncios no deseados y mayor control sobre tu privacidad. Pruébalo durante una semana y verás la diferencia. Como siempre, en este blog encontrarás trucos prácticos para sacarle partido a tu red sin complicarte.
