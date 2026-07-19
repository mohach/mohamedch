---
title: "DNS explicado: qué es y cómo configurarlo bien"
excerpt: "Descubre qué es el DNS, cómo funciona y aprende a configurarlo correctamente para mejorar tu velocidad y seguridad en Internet."
date: "2026-07-19"
lang: "es"
slug: "dns-explicado-que-es-y-como-configurarlo-bien"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

## ¿Qué es el DNS y por qué debería importarte?

El Sistema de Nombres de Dominio (DNS) es la agenda telefónica de Internet: traduce nombres como `mohamedch.com` en direcciones IP que los ordenadores entienden. Sin DNS, tendrías que recordar números como `185.199.108.153` para visitar cualquier web. Configurarlo bien no solo mejora la velocidad de navegación, sino que también protege tu privacidad y evita bloqueos innecesarios.

## Cómo funcionan las consultas DNS

Cuando escribes una URL en tu navegador, ocurre esto:

1. Tu sistema consulta primero la **caché local** (en el sistema operativo o navegador).
2. Si no hay resultado, pregunta al **resolver DNS** de tu ISP o al que tengas configurado.
3. El resolver recorre los servidores raíz, TLD (.com, .es) y autoritativos hasta dar con la IP.
4. La respuesta se guarda en caché durante el tiempo definido por el TTL (Time To Live).

Este proceso dura milisegundos, pero un DNS lento o poco fiable puede hacer que las páginas tarden en cargar. Por eso merece la pena optimizarlo.

## Cómo configurar DNS en tu sistema

### En Linux (NetworkManager)

Edita la configuración de tu conexión. Por ejemplo, para usar Cloudflare (1.1.1.1) y Google (8.8.8.8):

```bash
nmcli con mod "MiConexión" ipv4.dns "1.1.1.1 8.8.8.8"
nmcli con mod "MiConexión" ipv4.ignore-auto-dns yes
nmcli con up "MiConexión"
```

Para comprobarlo, ejecuta:

```bash
resolvectl status
```

### En Windows

Ve a `Panel de control > Centro de redes > Cambiar configuración del adaptador`. Haz clic derecho en tu conexión, selecciona `Propiedades`, luego `Protocolo de Internet versión 4 (TCP/IPv4)` y elige "Usar las siguientes direcciones de servidor DNS".

### En el router (recomendado)

Entra en la interfaz web del router (suele ser `192.168.1.1`), busca la sección WAN o Internet, y cambia los servidores DNS primario y secundario. Así todos los dispositivos de tu red lo heredan automáticamente.

## Los mejores DNS públicos que puedes usar

No todos los DNS son iguales. Estos son los que recomiendo tras años de pruebas:

| Proveedor | Primario | Secundario | Notas |
|-----------|----------|------------|-------|
| **Cloudflare** | 1.1.1.1 | 1.0.0.1 | El más rápido, respeta la privacidad |
| **Google** | 8.8.8.8 | 8.8.4.4 | Muy fiable, pero recopila datos |
| **Quad9** | 9.9.9.9 | 149.112.112.112 | Bloquea dominios maliciosos |
| **OpenDNS** | 208.67.222.222 | 208.67.220.220 | Control parental integrado |

Para elegir, haz una prueba rápida con `dig`:

```bash
dig @1.1.1.1 google.com | grep "Query time"
dig @8.8.8.8 google.com | grep "Query time"
```

El que devuelva el tiempo más bajo suele ser el mejor para tu ubicación.

## Verificación y solución de problemas

Después de cambiar los DNS, verifica que todo funciona:

```bash
nslookup mohamedch.com
```

Si ves la IP correcta y el servidor que configuraste, está bien. Para limpiar la caché local:

```bash
# Linux (systemd-resolved)
sudo resolvectl flush-caches

# Windows
ipconfig /flushdns
```

Si alguna web no carga, prueba con `dig +trace dominio.com` para ver dónde falla la cadena. Muchas veces el problema está en el TTL demasiado largo o en un servidor autoritativo caído.

## Conclusión

Configurar bien el DNS es uno de esos cambios pequeños que notarás en el día a día: páginas que cargan más rápido, menos cortes y más control sobre tu privacidad. Dedica cinco minutos a probar los servidores que te he recomendado y elige el que mejor vaya en tu conexión. Tu router y tu paciencia te lo agradecerán.
