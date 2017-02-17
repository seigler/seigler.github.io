---
title: VPS the Hard Way
parent: "Presentations"
date: 2015-06-16
---
### Title slide
![](vps-the-hard-way/VPS-the-hard-way - 01.jpg)

### What is a VPS?
![](vps-the-hard-way/VPS-the-hard-way - 02.jpg)
It stands for Virtual Private Server. Basically you get access to a virtual machine running with dozens of others in a rack in a server room somewhere with fast internet.
Since it's a virtual machine you can run whatever you want. It's cheap, it's unsupported, and it's all yours.

### Riddle me this!
![](vps-the-hard-way/VPS-the-hard-way - 03.jpg)
Why?
What good is it?

### Think back to when you first discovered the internet. It was so amazing. Mostly because you can do pretty much anything on it.
![](vps-the-hard-way/VPS-the-hard-way - 04.jpg)

### There's a service for everything!
![](vps-the-hard-way/VPS-the-hard-way - 05.jpg)

### So most of us pick one of the largest internet companies and use them for everything. It's just more convenient.
![](vps-the-hard-way/VPS-the-hard-way - 06.jpg)
But this also has some downsides.
If the company changes its offerings or policies, you don't always have any recourse. You may have a hard time getting your data out of their systems.
Also, these companies have very personal, deep knowledge about you. And they sometimes misuse that knowledge.
And not just companies...

### Intruders and government agencies can access your information through subterfuge or compulsion.
![](vps-the-hard-way/VPS-the-hard-way - 07.jpg)
But things aren't hopeless!

### You have the power!
![](vps-the-hard-way/VPS-the-hard-way - 08.jpg)
We're web developers! We are uniquely equipped to solve these problems, and at the same time pick up some valuable skills.
That's what we're going to do today. With a VPS of your own, you can set up alternatives to many of the services offered by internet giants like Google.

### Here is a site that catalogs the price of virtual private servers from different providers.
![](vps-the-hard-way/VPS-the-hard-way - 09.jpg)

### Most VPS providers offer at least CentOS and Debian, but you'll find pretty much everything out there, including more desktop-oriented distros like Ubuntu.
![](vps-the-hard-way/VPS-the-hard-way - 10.jpg)
Some providers even let you provide your own OS template.
Everyone has different priorities and different recommendations. Later we'll set up a new Debian 7 VPS.

### Where do you find these self-hosted packages? I like this site, “alternativeTo”, which lists self-hosted software that can take the place of commercial or non-free solutions.
![](vps-the-hard-way/VPS-the-hard-way - 11.jpg)

### Ok, let's get our hands dirty.
![](vps-the-hard-way/VPS-the-hard-way - 12.jpg)
Next:
A brief word on password management
New server checklist
Installing and configuring Nginx, PHP-FPM, and MariaDB
Installing a few self-hosted services
Installing a self-signed SSL certificate (time permitting)
Automating all of this

### Passwords kinda suck. If we take security seriously (you all do, right? Right?), we end up like that guy from the Matrix Reloaded, with keys for everything. How can anyone keep that straight?
![](vps-the-hard-way/VPS-the-hard-way - 13.jpg)
You can't. "Ain't nobody got time for that!"
So we come up with some scheme that basically lets us use the same thing, or similar things, everywhere. Then you have a new problem.
There's a better way. I can talk more about this after the talk, but for now I'll just say that I'm never going back to the old way. A password manager is just too convenient and secure.

## Debian VPS setup

### Admin user setup

SSH to your VPS as root

```
$ ssh root@###.###.###.###
```

Set a new password for root and save it in your password manager.

```
# passwd
```

Next we need to update the system.

```
# apt-get update &amp;&amp; apt-get dist-upgrade
```

(this will take a while, and you may have to dismiss some changelog messages and answer a prompt asking permission to disable root login over ssh. Don’t accept the prompt. We’ll disable root login over ssh later. This way we can’t lock ourselves out.)

```
# apt-get install sudo
# adduser username
# usermod -aG sudo username
# groupadd sshlogin
# usermod -aG sshlogin username
# cat /etc/sudoers
```

Confirm that this line is present:

```
%sudo   ALL=(ALL:ALL) ALL
```

If not, you can edit /etc/sudoers with # visudo

Now, leave this connection open and start a new one.

```
$ ssh username@###.###.###.###
```

Confirm that you have root access:

```
$ sudo whoami
```

It should say “root”.
If this was successful, go ahead and end your first (root) SSH session with Ctrl+D.
If you didn’t already disable root login over SSH we’ll do it now.

```
$ sudo nano /etc/ssh/sshd_config
```

Find the line <code>#PermitRootLogin no</code> and remove the "#" to uncomment it.
If you want to enable motd or banner do that now.
Ctrl+X, save changes
Restart ssh daemon with:

```
$ sudo service ssh restart
```

Confirm that you can no longer SSH in as root.
As one more precaution, we will expire the root password altogether so that the only account with admin access is the new account you’ve just created. The command is:

```
$ sudo passwd -l root
```

If you didn't already do it during the dist-upgrade, we should enable unattended security upgrades:

```
$ sudo apt-get install unattended-upgrades
$ sudo dpkg-reconfigure unattended-upgrades
```

You'll see a prompt asking if you want to automatically download and install stable updates. Choose yes.

<h2>Firewall</h2>

This part’s pretty easy.

```
$ sudo apt-get install ufw
```

UFW stands for Uncomplicated Firewall.

```
$ sudo nano /etc/default/ufw
```

Make sure that IPv6 is either enabled or disabled, whichever is appropriate for your VPS.

```
$ sudo ufw allow ssh
$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
$ sudo ufw enable
$ sudo ufw status
```

If you’re worried about getting hammered by port scanners and script kiddies, you can also install fail2ban, which temporarily blocks IP addresses that fail auth attempts too many times.
More details on that here: http://johnny.chadda.se/using-fail2ban-with-nginx-and-ufw/

## Optional

Change the hostname: https://wiki.debian.org/HowTo/ChangeHostname
Kind of a pain.

## Nginx, PHP, MySQL

### Installation

```
$ sudo apt-get install nginx php5 php5-fpm php5-cli php-apc php-gd
$ sudo apt-get install python-software-properties
$ sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xcbcb082a1bb943db
$ sudo apt-get install software-properties-common
```

Repository details from: https://downloads.mariadb.org/mariadb/repositories/

```
$ sudo add-apt-repository 'deb http://ftp.utexas.edu/mariadb/repo/10.0/debian wheezy main'
$ sudo apt-get update
$ sudo apt-get install mariadb-server php5-mysql
```

Leave the root password blank for now, we’ll set it in a second.

```
$ mysql-secure-installation
```

Follow the prompts, taking the recommended actions including creating a root password. Save the mysql root password to your password database.

### There are automated solutions for setting up a new server. Ansible is new and clean and considered by many to be the best right now, Puppet and Chef and some others like CFEngine and Salt can get the job done too.
![](vps-the-hard-way/VPS-the-hard-way - 20.jpg)
<a href="https://www.youtube.com/watch?v=up3ofvQNm8c">System provisioning with Ansible – a live demo</a>.

### Ok let's install FreshRSS, Shaarli, and LimeSurvey. First we have to configure nginx. I'm going to cheat a little here.
![](vps-the-hard-way/VPS-the-hard-way - 21.jpg)

```
$ sudo wget https://joshua.seigler.net/code/vps-the-hard-way/default.conf.txt -O /etc/nginx/conf.d/default.conf
$ sudo rm /etc/nginx/sites-enabled/default
```
