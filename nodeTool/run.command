Last login: Thu Dec 15 08:22:49 on console
MacdeiMac:~ deep$ show ip
-bash: show: command not found
MacdeiMac:~ deep$ ifconfig
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=3<RXCSUM,TXCSUM>
	inet6 ::1 prefixlen 128 
	inet 127.0.0.1 netmask 0xff000000 
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
	nd6 options=1<PERFORMNUD>
gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280
stf0: flags=0<> mtu 1280
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=10b<RXCSUM,TXCSUM,VLAN_HWTAGGING,AV>
	ether 38:c9:86:1a:42:fe 
	nd6 options=1<PERFORMNUD>
	media: autoselect (none)
	status: inactive
en1: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether b8:09:8a:bc:7f:7f 
	inet6 fe80::ba09:8aff:febc:7f7f%en1 prefixlen 64 scopeid 0x5 
	inet 192.168.32.233 netmask 0xffffff00 broadcast 192.168.32.255
	nd6 options=1<PERFORMNUD>
	media: autoselect
	status: active
en2: flags=963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX> mtu 1500
	options=60<TSO4,TSO6>
	ether 32:00:12:28:80:00 
	media: autoselect <full-duplex>
	status: inactive
en3: flags=963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX> mtu 1500
	options=60<TSO4,TSO6>
	ether 32:00:12:28:80:01 
	media: autoselect <full-duplex>
	status: inactive
bridge0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=63<RXCSUM,TXCSUM,TSO4,TSO6>
	ether 3a:c9:86:a1:da:00 
	Configuration:
		id 0:0:0:0:0:0 priority 0 hellotime 0 fwddelay 0
		maxage 0 holdcnt 0 proto stp maxaddr 100 timeout 1200
		root id 0:0:0:0:0:0 priority 0 ifcost 0 port 0
		ipfilter disabled flags 0x2
	member: en2 flags=3<LEARNING,DISCOVER>
	        ifmaxaddr 0 port 6 priority 0 path cost 0
	member: en3 flags=3<LEARNING,DISCOVER>
	        ifmaxaddr 0 port 7 priority 0 path cost 0
	nd6 options=1<PERFORMNUD>
	media: <unknown type>
	status: inactive
p2p0: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 2304
	ether 0a:09:8a:bc:7f:7f 
	media: autoselect
	status: inactive
awdl0: flags=8943<UP,BROADCAST,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1484
	ether da:e8:24:5e:c1:fc 
	inet6 fe80::d8e8:24ff:fe5e:c1fc%awdl0 prefixlen 64 scopeid 0xa 
	nd6 options=1<PERFORMNUD>
	media: autoselect
	status: active
MacdeiMac:~ deep$ ifconfig -a
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=3<RXCSUM,TXCSUM>
	inet6 ::1 prefixlen 128 
	inet 127.0.0.1 netmask 0xff000000 
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
	nd6 options=1<PERFORMNUD>
gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280
stf0: flags=0<> mtu 1280
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=10b<RXCSUM,TXCSUM,VLAN_HWTAGGING,AV>
	ether 38:c9:86:1a:42:fe 
	nd6 options=1<PERFORMNUD>
	media: autoselect (none)
	status: inactive
en1: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether b8:09:8a:bc:7f:7f 
	inet6 fe80::ba09:8aff:febc:7f7f%en1 prefixlen 64 scopeid 0x5 
	inet 192.168.32.233 netmask 0xffffff00 broadcast 192.168.32.255
	nd6 options=1<PERFORMNUD>
	media: autoselect
	status: active
en2: flags=963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX> mtu 1500
	options=60<TSO4,TSO6>
	ether 32:00:12:28:80:00 
	media: autoselect <full-duplex>
	status: inactive
en3: flags=963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX> mtu 1500
	options=60<TSO4,TSO6>
	ether 32:00:12:28:80:01 
	media: autoselect <full-duplex>
	status: inactive
bridge0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=63<RXCSUM,TXCSUM,TSO4,TSO6>
	ether 3a:c9:86:a1:da:00 
	Configuration:
		id 0:0:0:0:0:0 priority 0 hellotime 0 fwddelay 0
		maxage 0 holdcnt 0 proto stp maxaddr 100 timeout 1200
		root id 0:0:0:0:0:0 priority 0 ifcost 0 port 0
		ipfilter disabled flags 0x2
	member: en2 flags=3<LEARNING,DISCOVER>
	        ifmaxaddr 0 port 6 priority 0 path cost 0
	member: en3 flags=3<LEARNING,DISCOVER>
	        ifmaxaddr 0 port 7 priority 0 path cost 0
	nd6 options=1<PERFORMNUD>
	media: <unknown type>
	status: inactive
p2p0: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 2304
	ether 0a:09:8a:bc:7f:7f 
	media: autoselect
	status: inactive
awdl0: flags=8943<UP,BROADCAST,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1484
	ether da:e8:24:5e:c1:fc 
	inet6 fe80::d8e8:24ff:fe5e:c1fc%awdl0 prefixlen 64 scopeid 0xa 
	nd6 options=1<PERFORMNUD>
	media: autoselect
	status: active
MacdeiMac:~ deep$ 
MacdeiMac:~ deep$ 
MacdeiMac:~ deep$ git -v
Unknown option: -v
usage: git [--version] [--help] [-C <path>] [-c name=value]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]
MacdeiMac:~ deep$ git --version
git version 2.10.1
MacdeiMac:~ deep$ cd ~/.ssh
-bash: cd: /Users/deep/.ssh: No such file or directory
MacdeiMac:~ deep$ ssh-keygen -t rsa -C "841354162@qq.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/deep/.ssh/id_rsa): 
Created directory '/Users/deep/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/deep/.ssh/id_rsa.
Your public key has been saved in /Users/deep/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:nrnEreHbkgy32+HkdG8ntlV6xmjQxFKQV7GZBXMxuyI 841354162@qq.com
The key's randomart image is:
+---[RSA 2048]----+
|            .o+**|
|            .o.oB|
|            ..o= |
|             +  .|
|        S  E.....|
|      .o.+  ...+.|
|       +Bo= . + =|
|       o=@ o o++.|
|        *+=  oo+ |
+----[SHA256]-----+
MacdeiMac:~ deep$ clip < ~/.ssh/id_rsa.pub
-bash: clip: command not found
MacdeiMac:~ deep$ cat ~/.ssh/id_rsa.pub |pbcopy
MacdeiMac:~ deep$ ls

;s

