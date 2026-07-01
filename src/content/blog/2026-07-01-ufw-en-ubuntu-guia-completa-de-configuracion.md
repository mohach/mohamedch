---
title: "UFW en Ubuntu: guía completa de configuración"
excerpt: "Guía completa para configurar UFW en Ubuntu: reglas, ejemplos prácticos y consejos para proteger tu servidor Linux."
date: "2026-07-01"
lang: "es"
slug: "ufw-en-ubuntu-guia-completa-de-configuracion"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando trabajamos con servidores Ubuntu, la seguridad del sistema es una prioridad que no podemos descuidar. Una de las herramientas más accesibles y eficaces para empezar a proteger nuestra máquina es UFW (Uncomplicated Firewall). A pesar de su nombre, ofrece una potencia considerable para gestionar el tráfico de red de forma sencilla y directa desde la terminal.

## Instalación y estado inicial

UFW suele venir preinstalado en Ubuntu, pero si no es el caso, podemos instalarlo fácilmente:

```bash
sudo apt update
sudo apt install ufw
```

Antes de activarlo, es recomendable verificar su estado. Por defecto, estará inactivo:

```bash
sudo ufw status
```

Si queremos ver información más detallada, incluyendo los números de regla, usamos:

```bash
sudo ufw status numbered
```

## Configuración de reglas básicas

El primer paso sensato es establecer una política por defecto restrictiva: denegar todo el tráfico entrante y permitir todo el saliente. Esto nos da una base segura sobre la que construir.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Ahora, añadimos las reglas para los servicios que necesitamos exponer. Los ejemplos más comunes son SSH, HTTP y HTTPS:

```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Podemos especificar puertos de forma numérica o usar nombres de servicio conocidos. Para un servidor web típico, esto suele ser suficiente. Si necesitamos un puerto específico, como el 3000 para una aplicación Node.js, lo hacemos así:

```bash
sudo ufw allow 3000/tcp
```

## Activación y gestión del firewall

Una vez definidas las reglas, activamos UFW con cuidado. Es vital tener una regla que permita SSH antes de activarlo, o podríamos quedarnos fuera del servidor. Activamos el firewall:

```bash
sudo ufw enable
```

Confirmamos la acción y, tras ello, podemos ver las reglas activas:

```bash
sudo ufw status verbose
```

Si en algún momento necesitamos desactivarlo temporalmente (por ejemplo, para solucionar un problema de conectividad):

```bash
sudo ufw disable
```

## Eliminar y modificar reglas

A veces necesitamos ajustar la configuración. Para eliminar una regla, lo más seguro es usar su número, que obtenemos con `sudo ufw status numbered`:

```bash
sudo ufw delete 3
```

También podemos eliminar por especificación exacta:

```bash
sudo ufw delete allow 3000/tcp
```

Si queremos denegar una IP concreta o un rango, lo hacemos así:

```bash
sudo ufw deny from 192.168.1.100
sudo ufw deny from 10.0.0.0/24
```

## Conclusión

UFW es una herramienta ligera pero potente que todo administrador de Ubuntu debería dominar. Con unos pocos comandos podemos asegurar nuestro servidor frente a accesos no deseados, manteniendo abiertos solo los puertos necesarios. La clave está en empezar con una política restrictiva e ir añadiendo reglas de forma controlada. Recuerda siempre verificar el estado tras cada cambio y, sobre todo, no olvidar la regla SSH antes de activar el firewall.
