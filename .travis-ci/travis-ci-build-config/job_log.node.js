language: node_js
node_js:
  - 12
cache:
  directories:
    - node_modules
script:
  - npm run test
  - npm run bundle
© 2021 GitHub Michael Glenn
travis_fold:start:worker_info
[0K[33;1mWorker information[0m
hostname: 0907ec3c-8463-401e-8190-501b4fd49975@1.worker-com-65f4cb59fb-mkvf6.gce-production-2
version: 6.2.22 https://github.com/travis-ci/worker/tree/858cb91994a513269f2fe9782c15fc113e966231
instance: travis-job-343cac70-24b3-4a96-b8bc-a60b6f7578e9 travis-ci-sardonyx-xenial-1593004276-4d46c6b3 (via amqp)
startup: 6.212407418s
travis_fold:end:worker_info
[0Ktravis_time:start:05b60e20
[0Ktravis_time:end:05b60e20:start=1635380563566363671,finish=1635380563703876814,duration=137513143,event=no_world_writable_dirs
[0Ktravis_time:start:0d77aa40
[0Ktravis_time:end:0d77aa40:start=1635380563707170357,finish=1635380563714221731,duration=7051374,event=agent
[0Ktravis_time:start:13884858
[0Ktravis_time:end:13884858:start=1635380563717004520,finish=1635380563719119972,duration=2115452,event=check_unsupported
[0Ktravis_time:start:008867d3
[0Ktravis_fold:start:system_info
[0K[33;1mBuild system information[0m
Build language: node_js
Build dist: xenial
Build id: 240724962
Job id: 545508192
Runtime kernel version: 4.15.0-1077-gcp
travis-build version: 267382cc
[34m[1mBuild image provisioning date and time[0m
Wed Jun 24 13:36:52 UTC 2020
[34m[1mOperating System Details[0m
Distributor ID:	Ubuntu
Description:	Ubuntu 16.04.6 LTS
Release:	16.04
Codename:	xenial
[34m[1mSystemd Version[0m
systemd 229
[34m[1mCookbooks Version[0m
3f92a99 https://github.com/travis-ci/travis-cookbooks/tree/3f92a99
[34m[1mgit version[0m
git version 2.27.0
[34m[1mbash version[0m
GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)
[34m[1mgcc version[0m
gcc (Ubuntu 5.4.0-6ubuntu1~16.04.12) 5.4.0 20160609
[34m[1mdocker version[0m
Client:
 Version:           18.06.0-ce
 API version:       1.38
 Go version:        go1.10.3
 Git commit:        0ffa825
 Built:             Wed Jul 18 19:11:02 2018
 OS/Arch:           linux/amd64
 Experimental:      false

Server:
 Engine:
  Version:          18.06.0-ce
  API version:      1.38 (minimum version 1.12)
  Go version:       go1.10.3
  Git commit:       0ffa825
  Built:            Wed Jul 18 19:09:05 2018
  OS/Arch:          linux/amd64
  Experimental:     false
[34m[1mclang version[0m
clang version 7.0.0 (tags/RELEASE_700/final)
[34m[1mjq version[0m
jq-1.5
[34m[1mbats version[0m
Bats 0.4.0
[34m[1mshellcheck version[0m
0.7.0
[34m[1mshfmt version[0m
v2.6.3
[34m[1mccache version[0m
3.2.4
[34m[1mcmake version[0m
cmake version 3.12.4
[34m[1mheroku version[0m
heroku/7.42.1 linux-x64 node-v12.16.2
[34m[1mimagemagick version[0m
Version: ImageMagick 6.8.9-9 Q16 x86_64 2019-11-12 http://www.imagemagick.org
[34m[1mmd5deep version[0m
4.4
[34m[1mmercurial version[0m
version 4.8
[34m[1mmysql version[0m
mysql  Ver 14.14 Distrib 5.7.30, for Linux (x86_64) using  EditLine wrapper
[34m[1mopenssl version[0m
OpenSSL 1.0.2g  1 Mar 2016
[34m[1mpacker version[0m
1.3.3
[34m[1mpostgresql client version[0m
psql (PostgreSQL) 10.13 (Ubuntu 10.13-1.pgdg16.04+1)
[34m[1mragel version[0m
Ragel State Machine Compiler version 6.8 Feb 2013
[34m[1msudo version[0m
1.8.16
[34m[1mgzip version[0m
gzip 1.6
[34m[1mzip version[0m
Zip 3.0
[34m[1mvim version[0m
VIM - Vi IMproved 7.4 (2013 Aug 10, compiled Mar 18 2020 14:06:17)
[34m[1miptables version[0m
iptables v1.6.0
[34m[1mcurl version[0m
curl 7.47.0 (x86_64-pc-linux-gnu) libcurl/7.47.0 GnuTLS/3.4.10 zlib/1.2.8 libidn/1.32 librtmp/2.3
[34m[1mwget version[0m
GNU Wget 1.17.1 built on linux-gnu.
[34m[1mrsync version[0m
rsync  version 3.1.1  protocol version 31
[34m[1mgimme version[0m
v1.5.4
[34m[1mnvm version[0m
0.35.3
[34m[1mperlbrew version[0m
/home/travis/perl5/perlbrew/bin/perlbrew  - App::perlbrew/0.88
[34m[1mphpenv version[0m
rbenv 1.1.2-30-gc879cb0
[34m[1mrvm version[0m
rvm 1.29.10 (latest) by Michal Papis, Piotr Kuczynski, Wayne E. Seguin [https://rvm.io]
[34m[1mdefault ruby version[0m
ruby 2.5.3p105 (2018-10-18 revision 65156) [x86_64-linux]
[34m[1mCouchDB version[0m
couchdb 1.6.1
[34m[1mElasticSearch version[0m
5.5.0
[34m[1mInstalled Firefox version[0m
firefox 63.0.1
[34m[1mMongoDB version[0m
MongoDB 4.0.19
[34m[1mPhantomJS version[0m
2.1.1
[34m[1mPre-installed PostgreSQL versions[0m
9.4.26
9.5.22
9.6.18
[34m[1mRedis version[0m
redis-server 6.0.5
[34m[1mPre-installed Go versions[0m
1.11.1
[34m[1mant version[0m
Apache Ant(TM) version 1.9.6 compiled on July 20 2018
[34m[1mmvn version[0m
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
[34m[1mgradle version[0m
Gradle 5.1.1!
[34m[1mlein version[0m
Leiningen 2.9.3 on Java 11.0.2 OpenJDK 64-Bit Server VM
[34m[1mPre-installed Node.js versions[0m
v10.21.0
v11.0.0
v12.18.1
v4.9.1
v6.17.1
v8.12.0
v8.17.0
v8.9
[34m[1mphpenv versions[0m
  system
  5.6
  5.6.40
  7.1
  7.1.27
  7.2
* 7.2.15 (set by /home/travis/.phpenv/version)
  hhvm
  hhvm-stable
[34m[1mcomposer --version[0m
Composer version 1.8.4 2019-02-11 10:52:10
[34m[1mPre-installed Ruby versions[0m
ruby-2.3.8
ruby-2.4.5
ruby-2.5.3
travis_fold:end:system_info
[0K
travis_time:end:008867d3:start=1635380563721916584,finish=1635380563728247468,duration=6330884,event=show_system_info
[0Ktravis_time:start:10f2717e
[0Ktravis_time:end:10f2717e:start=1635380563731058711,finish=1635380563746906542,duration=15847831,event=rm_riak_source
[0Ktravis_time:start:2b473686
[0Ktravis_time:end:2b473686:start=1635380563750304259,finish=1635380563757610068,duration=7305809,event=fix_rwky_redis
[0Ktravis_time:start:010b14dc
[0Ktravis_time:end:010b14dc:start=1635380563760828445,finish=1635380564187783014,duration=426954569,event=wait_for_network
[0Ktravis_time:start:058f953f
[0Ktravis_time:end:058f953f:start=1635380564190936613,finish=1635380564407352145,duration=216415532,event=update_apt_keys
[0Ktravis_time:start:0120b2bc
[0Ktravis_time:end:0120b2bc:start=1635380564410502662,finish=1635380564461269194,duration=50766532,event=fix_hhvm_source
[0Ktravis_time:start:15bed58c
[0Ktravis_time:end:15bed58c:start=1635380564465041600,finish=1635380564467763238,duration=2721638,event=update_mongo_arch
[0Ktravis_time:start:05cb7f3d
[0Ktravis_time:end:05cb7f3d:start=1635380564470855568,finish=1635380564509959108,duration=39103540,event=fix_sudo_enabled_trusty
[0Ktravis_time:start:00e36568
[0Ktravis_time:end:00e36568:start=1635380564513058348,finish=1635380564515214392,duration=2156044,event=update_glibc
[0Ktravis_time:start:108c00c2
[0Ktravis_time:end:108c00c2:start=1635380564517981707,finish=1635380564525454521,duration=7472814,event=clean_up_path
[0Ktravis_time:start:3ecdba82
[0Ktravis_time:end:3ecdba82:start=1635380564528122896,finish=1635380564535538407,duration=7415511,event=fix_resolv_conf
[0Ktravis_time:start:26c89972
[0Ktravis_time:end:26c89972:start=1635380564538368338,finish=1635380564546420388,duration=8052050,event=fix_etc_hosts
[0Ktravis_time:start:0d82b9bf
[0Ktravis_time:end:0d82b9bf:start=1635380564549045553,finish=1635380564559515615,duration=10470062,event=fix_mvn_settings_xml
[0Ktravis_time:start:01816dbe
[0Ktravis_time:end:01816dbe:start=1635380564562568602,finish=1635380564571528061,duration=8959459,event=no_ipv6_localhost
[0Ktravis_time:start:00984588
[0Ktravis_time:end:00984588:start=1635380564574445571,finish=1635380564576662878,duration=2217307,event=fix_etc_mavenrc
[0Ktravis_time:start:1596033b
[0Ktravis_time:end:1596033b:start=1635380564579631895,finish=1635380564582652635,duration=3020740,event=fix_wwdr_certificate
[0Ktravis_time:start:0d50bd3a
[0Ktravis_time:end:0d50bd3a:start=1635380564585545429,finish=1635380564608872940,duration=23327511,event=put_localhost_first
[0Ktravis_time:start:0c7d5ef4
[0Ktravis_time:end:0c7d5ef4:start=1635380564611913247,finish=1635380564614709942,duration=2796695,event=home_paths
[0Ktravis_time:start:00d31d72
[0Ktravis_time:end:00d31d72:start=1635380564617579125,finish=1635380564629164539,duration=11585414,event=disable_initramfs
[0Ktravis_time:start:13ccf328
[0Ktravis_time:end:13ccf328:start=1635380564632152837,finish=1635380564953889764,duration=321736927,event=disable_ssh_roaming
[0Ktravis_time:start:31e9d0a3
[0Ktravis_time:end:31e9d0a3:start=1635380564956921444,finish=1635380564959052022,duration=2130578,event=debug_tools
[0Ktravis_time:start:02cedc70
[0Ktravis_time:end:02cedc70:start=1635380564961883873,finish=1635380564964847326,duration=2963453,event=uninstall_oclint
[0Ktravis_time:start:31ac0e32
[0Ktravis_time:end:31ac0e32:start=1635380564967756622,finish=1635380564970578654,duration=2822032,event=rvm_use
[0Ktravis_time:start:0122d60c
[0Ktravis_time:end:0122d60c:start=1635380564973368305,finish=1635380564980461985,duration=7093680,event=rm_etc_boto_cfg
[0Ktravis_time:start:010781d0
[0Ktravis_time:end:010781d0:start=1635380564983147773,finish=1635380564986259727,duration=3111954,event=rm_oraclejdk8_symlink
[0Ktravis_time:start:213d76d5
[0Ktravis_time:end:213d76d5:start=1635380564989067762,finish=1635380565080153829,duration=91086067,event=enable_i386
[0Ktravis_time:start:20012225
[0Ktravis_time:end:20012225:start=1635380565083320013,finish=1635380565088762857,duration=5442844,event=update_rubygems
[0Ktravis_time:start:22351a2a
[0Ktravis_time:end:22351a2a:start=1635380565091683395,finish=1635380565870253045,duration=778569650,event=ensure_path_components
[0Ktravis_time:start:1a99aa4a
[0Ktravis_time:end:1a99aa4a:start=1635380565873569917,finish=1635380565875718228,duration=2148311,event=redefine_curl
[0Ktravis_time:start:044cc060
[0Ktravis_time:end:044cc060:start=1635380565878515441,finish=1635380565880504438,duration=1988997,event=nonblock_pipe
[0Ktravis_time:start:02c663c4
[0Ktravis_time:end:02c663c4:start=1635380565883243482,finish=1635380571912638335,duration=6029394853,event=apt_get_update
[0Ktravis_time:start:01b7e08f
[0Ktravis_time:end:01b7e08f:start=1635380571916197438,finish=1635380571918568515,duration=2371077,event=deprecate_xcode_64
[0Ktravis_time:start:0546509c
[0Ktravis_time:end:0546509c:start=1635380571921472501,finish=1635380574648046537,duration=2726574036,event=update_heroku
[0Ktravis_time:start:2070ac4e
[0Ktravis_time:end:2070ac4e:start=1635380574651130994,finish=1635380574653229940,duration=2098946,event=shell_session_update
[0Ktravis_time:start:141f8850
[0Ktravis_fold:start:docker_mtu_and_registry_mirrors
[0Ktravis_fold:end:docker_mtu_and_registry_mirrors
[0Ktravis_time:end:141f8850:start=1635380574655960877,finish=1635380577294212313,duration=2638251436,event=set_docker_mtu_and_registry_mirrors
[0Ktravis_time:start:10f8cbec
[0Ktravis_fold:start:resolvconf
[0Ktravis_fold:end:resolvconf
[0Ktravis_time:end:10f8cbec:start=1635380577297290470,finish=1635380577360712008,duration=63421538,event=resolvconf
[0Ktravis_time:start:1ebff7db
[0Ktravis_time:end:1ebff7db:start=1635380577366747989,finish=1635380577504061452,duration=137313463,event=maven_central_mirror
[0Ktravis_time:start:0a1a6aef
[0Ktravis_time:end:0a1a6aef:start=1635380577507277647,finish=1635380577591270788,duration=83993141,event=maven_https
[0Ktravis_time:start:00c69d6e
[0Ktravis_time:end:00c69d6e:start=1635380577594844374,finish=1635380577596975375,duration=2131001,event=fix_ps4
[0Ktravis_time:start:0c9cc186
[0K
travis_fold:start:git.checkout
[0Ktravis_time:start:02d3c708
[0K$ git clone --depth=50 https://github.com/mapbox/mapbox-sdk-js.git mapbox/mapbox-sdk-js
Cloning into 'mapbox/mapbox-sdk-js'...
remote: Enumerating objects: 456, done.[K
remote: Counting objects:   0% (1/456)[K
remote: Counting objects:   1% (5/456)[K
remote: Counting objects:   2% (10/456)[K
remote: Counting objects:   3% (14/456)[K
remote: Counting objects:   4% (19/456)[K
remote: Counting objects:   5% (23/456)[K
remote: Counting objects:   6% (28/456)[K
remote: Counting objects:   7% (32/456)[K
remote: Counting objects:   8% (37/456)[K
remote: Counting objects:   9% (42/456)[K
remote: Counting objects:  10% (46/456)[K
remote: Counting objects:  11% (51/456)[K
remote: Counting objects:  12% (55/456)[K
remote: Counting objects:  13% (60/456)[K
remote: Counting objects:  14% (64/456)[K
remote: Counting objects:  15% (69/456)[K
remote: Counting objects:  16% (73/456)[K
remote: Counting objects:  17% (78/456)[K
remote: Counting objects:  18% (83/456)[K
remote: Counting objects:  19% (87/456)[K
remote: Counting objects:  20% (92/456)[K
remote: Counting objects:  21% (96/456)[K
remote: Counting objects:  22% (101/456)[K
remote: Counting objects:  23% (105/456)[K
remote: Counting objects:  24% (110/456)[K
remote: Counting objects:  25% (114/456)[K
remote: Counting objects:  26% (119/456)[K
remote: Counting objects:  27% (124/456)[K
remote: Counting objects:  28% (128/456)[K
remote: Counting objects:  29% (133/456)[K
remote: Counting objects:  30% (137/456)[K
remote: Counting objects:  31% (142/456)[K
remote: Counting objects:  32% (146/456)[K
remote: Counting objects:  33% (151/456)[K
remote: Counting objects:  34% (156/456)[K
remote: Counting objects:  35% (160/456)[K
remote: Counting objects:  36% (165/456)[K
remote: Counting objects:  37% (169/456)[K
remote: Counting objects:  38% (174/456)[K
remote: Counting objects:  39% (178/456)[K
remote: Counting objects:  40% (183/456)[K
remote: Counting objects:  41% (187/456)[K
remote: Counting objects:  42% (192/456)[K
remote: Counting objects:  43% (197/456)[K
remote: Counting objects:  44% (201/456)[K
remote: Counting objects:  45% (206/456)[K
remote: Counting objects:  46% (210/456)[K
remote: Counting objects:  47% (215/456)[K
remote: Counting objects:  48% (219/456)[K
remote: Counting objects:  49% (224/456)[K
remote: Counting objects:  50% (228/456)[K
remote: Counting objects:  51% (233/456)[K
remote: Counting objects:  52% (238/456)[K
remote: Counting objects:  53% (242/456)[K
remote: Counting objects:  54% (247/456)[K
remote: Counting objects:  55% (251/456)[K
remote: Counting objects:  56% (256/456)[K
remote: Counting objects:  57% (260/456)[K
remote: Counting objects:  58% (265/456)[K
remote: Counting objects:  59% (270/456)[K
remote: Counting objects:  60% (274/456)[K
remote: Counting objects:  61% (279/456)[K
remote: Counting objects:  62% (283/456)[K
remote: Counting objects:  63% (288/456)[K
remote: Counting objects:  64% (292/456)[K
remote: Counting objects:  65% (297/456)[K
remote: Counting objects:  66% (301/456)[K
remote: Counting objects:  67% (306/456)[K
remote: Counting objects:  68% (311/456)[K
remote: Counting objects:  69% (315/456)[K
remote: Counting objects:  70% (320/456)[K
remote: Counting objects:  71% (324/456)[K
remote: Counting objects:  72% (329/456)[K
remote: Counting objects:  73% (333/456)[K
remote: Counting objects:  74% (338/456)[K
remote: Counting objects:  75% (342/456)[K
remote: Counting objects:  76% (347/456)[K
remote: Counting objects:  77% (352/456)[K
remote: Counting objects:  78% (356/456)[K
remote: Counting objects:  79% (361/456)[K
remote: Counting objects:  80% (365/456)[K
remote: Counting objects:  81% (370/456)[K
remote: Counting objects:  82% (374/456)[K
remote: Counting objects:  83% (379/456)[K
remote: Counting objects:  84% (384/456)[K
remote: Counting objects:  85% (388/456)[K
remote: Counting objects:  86% (393/456)[K
remote: Counting objects:  87% (397/456)[K
remote: Counting objects:  88% (402/456)[K
remote: Counting objects:  89% (406/456)[K
remote: Counting objects:  90% (411/456)[K
remote: Counting objects:  91% (415/456)[K
remote: Counting objects:  92% (420/456)[K
remote: Counting objects:  93% (425/456)[K
remote: Counting objects:  94% (429/456)[K
remote: Counting objects:  95% (434/456)[K
remote: Counting objects:  96% (438/456)[K
remote: Counting objects:  97% (443/456)[K
remote: Counting objects:  98% (447/456)[K
remote: Counting objects:  99% (452/456)[K
remote: Counting objects: 100% (456/456)[K
remote: Counting objects: 100% (456/456), done.[K
remote: Compressing objects:   0% (1/282)[K
remote: Compressing objects:   1% (3/282)[K
remote: Compressing objects:   2% (6/282)[K
remote: Compressing objects:   3% (9/282)[K
remote: Compressing objects:   4% (12/282)[K
remote: Compressing objects:   5% (15/282)[K
remote: Compressing objects:   6% (17/282)[K
remote: Compressing objects:   7% (20/282)[K
remote: Compressing objects:   8% (23/282)[K
remote: Compressing objects:   9% (26/282)[K
remote: Compressing objects:  10% (29/282)[K
remote: Compressing objects:  11% (32/282)[K
remote: Compressing objects:  12% (34/282)[K
remote: Compressing objects:  13% (37/282)[K
remote: Compressing objects:  14% (40/282)[K
remote: Compressing objects:  15% (43/282)[K
remote: Compressing objects:  16% (46/282)[K
remote: Compressing objects:  17% (48/282)[K
remote: Compressing objects:  18% (51/282)[K
remote: Compressing objects:  19% (54/282)[K
remote: Compressing objects:  20% (57/282)[K
remote: Compressing objects:  21% (60/282)[K
remote: Compressing objects:  22% (63/282)[K
remote: Compressing objects:  23% (65/282)[K
remote: Compressing objects:  24% (68/282)[K
remote: Compressing objects:  25% (71/282)[K
remote: Compressing objects:  26% (74/282)[K
remote: Compressing objects:  27% (77/282)[K
remote: Compressing objects:  28% (79/282)[K
remote: Compressing objects:  29% (82/282)[K
remote: Compressing objects:  30% (85/282)[K
remote: Compressing objects:  31% (88/282)[K
remote: Compressing objects:  32% (91/282)[K
remote: Compressing objects:  33% (94/282)[K
remote: Compressing objects:  34% (96/282)[K
remote: Compressing objects:  35% (99/282)[K
remote: Compressing objects:  36% (102/282)[K
remote: Compressing objects:  37% (105/282)[K
remote: Compressing objects:  38% (108/282)[K
remote: Compressing objects:  39% (110/282)[K
remote: Compressing objects:  40% (113/282)[K
remote: Compressing objects:  41% (116/282)[K
remote: Compressing objects:  42% (119/282)[K
remote: Compressing objects:  43% (122/282)[K
remote: Compressing objects:  44% (125/282)[K
remote: Compressing objects:  45% (127/282)[K
remote: Compressing objects:  46% (130/282)[K
remote: Compressing objects:  47% (133/282)[K
remote: Compressing objects:  48% (136/282)[K
remote: Compressing objects:  49% (139/282)[K
remote: Compressing objects:  50% (141/282)[K
remote: Compressing objects:  51% (144/282)[K
remote: Compressing objects:  52% (147/282)[K
remote: Compressing objects:  53% (150/282)[K
remote: Compressing objects:  54% (153/282)[K
remote: Compressing objects:  55% (156/282)[K
remote: Compressing objects:  56% (158/282)[K
remote: Compressing objects:  57% (161/282)[K
remote: Compressing objects:  58% (164/282)[K
remote: Compressing objects:  59% (167/282)[K
remote: Compressing objects:  60% (170/282)[K
remote: Compressing objects:  61% (173/282)[K
remote: Compressing objects:  62% (175/282)[K
remote: Compressing objects:  63% (178/282)[K
remote: Compressing objects:  64% (181/282)[K
remote: Compressing objects:  65% (184/282)[K
remote: Compressing objects:  66% (187/282)[K
remote: Compressing objects:  67% (189/282)[K
remote: Compressing objects:  68% (192/282)[K
remote: Compressing objects:  69% (195/282)[K
remote: Compressing objects:  70% (198/282)[K
remote: Compressing objects:  71% (201/282)[K
remote: Compressing objects:  72% (204/282)[K
remote: Compressing objects:  73% (206/282)[K
remote: Compressing objects:  74% (209/282)[K
remote: Compressing objects:  75% (212/282)[K
remote: Compressing objects:  76% (215/282)[K
remote: Compressing objects:  77% (218/282)[K
remote: Compressing objects:  78% (220/282)[K
remote: Compressing objects:  79% (223/282)[K
remote: Compressing objects:  80% (226/282)[K
remote: Compressing objects:  81% (229/282)[K
remote: Compressing objects:  82% (232/282)[K
remote: Compressing objects:  83% (235/282)[K
remote: Compressing objects:  84% (237/282)[K
remote: Compressing objects:  85% (240/282)[K
remote: Compressing objects:  86% (243/282)[K
remote: Compressing objects:  87% (246/282)[K
remote: Compressing objects:  88% (249/282)[K
remote: Compressing objects:  89% (251/282)[K
remote: Compressing objects:  90% (254/282)[K
remote: Compressing objects:  91% (257/282)[K
remote: Compressing objects:  92% (260/282)[K
remote: Compressing objects:  93% (263/282)[K
remote: Compressing objects:  94% (266/282)[K
remote: Compressing objects:  95% (268/282)[K
remote: Compressing objects:  96% (271/282)[K
remote: Compressing objects:  97% (274/282)[K
remote: Compressing objects:  98% (277/282)[K
remote: Compressing objects:  99% (280/282)[K
remote: Compressing objects: 100% (282/282)[K
remote: Compressing objects: 100% (282/282), done.[K
Receiving objects:   0% (1/456)
Receiving objects:   1% (5/456)
Receiving objects:   2% (10/456)
Receiving objects:   3% (14/456)
Receiving objects:   4% (19/456)
Receiving objects:   5% (23/456)
Receiving objects:   6% (28/456)
Receiving objects:   7% (32/456)
Receiving objects:   8% (37/456)
Receiving objects:   9% (42/456)
Receiving objects:  10% (46/456)
Receiving objects:  11% (51/456)
Receiving objects:  12% (55/456)
Receiving objects:  13% (60/456)
Receiving objects:  14% (64/456)
Receiving objects:  15% (69/456)
Receiving objects:  16% (73/456)
Receiving objects:  17% (78/456)
Receiving objects:  18% (83/456)
Receiving objects:  19% (87/456)
Receiving objects:  20% (92/456)
Receiving objects:  21% (96/456)
Receiving objects:  22% (101/456)
Receiving objects:  23% (105/456)
Receiving objects:  24% (110/456)
Receiving objects:  25% (114/456)
Receiving objects:  26% (119/456)
Receiving objects:  27% (124/456)
Receiving objects:  28% (128/456)
Receiving objects:  29% (133/456)
Receiving objects:  30% (137/456)
Receiving objects:  31% (142/456)
Receiving objects:  32% (146/456)
Receiving objects:  33% (151/456)
Receiving objects:  34% (156/456)
Receiving objects:  35% (160/456)
Receiving objects:  36% (165/456)
Receiving objects:  37% (169/456)
Receiving objects:  38% (174/456)
Receiving objects:  39% (178/456)
Receiving objects:  40% (183/456)
Receiving objects:  41% (187/456)
Receiving objects:  42% (192/456)
Receiving objects:  43% (197/456)
Receiving objects:  44% (201/456)
Receiving objects:  45% (206/456)
Receiving objects:  46% (210/456)
Receiving objects:  47% (215/456)
Receiving objects:  48% (219/456)
Receiving objects:  49% (224/456)
Receiving objects:  50% (228/456)
Receiving objects:  51% (233/456)
Receiving objects:  52% (238/456)
Receiving objects:  53% (242/456)
Receiving objects:  54% (247/456)
Receiving objects:  55% (251/456)
Receiving objects:  56% (256/456)
Receiving objects:  57% (260/456)
Receiving objects:  58% (265/456)
Receiving objects:  59% (270/456)
Receiving objects:  60% (274/456)
Receiving objects:  61% (279/456)
Receiving objects:  62% (283/456)
Receiving objects:  63% (288/456)
Receiving objects:  64% (292/456)
Receiving objects:  65% (297/456)
Receiving objects:  66% (301/456)
Receiving objects:  67% (306/456)
Receiving objects:  68% (311/456)
Receiving objects:  69% (315/456)
Receiving objects:  70% (320/456)
Receiving objects:  71% (324/456)
Receiving objects:  72% (329/456)
Receiving objects:  73% (333/456)
Receiving objects:  74% (338/456)
Receiving objects:  75% (342/456)
Receiving objects:  76% (347/456)
Receiving objects:  77% (352/456)
Receiving objects:  78% (356/456)
Receiving objects:  79% (361/456)
Receiving objects:  80% (365/456)
Receiving objects:  81% (370/456)
Receiving objects:  82% (374/456)
Receiving objects:  83% (379/456)
Receiving objects:  84% (384/456)
Receiving objects:  85% (388/456)
Receiving objects:  86% (393/456)
Receiving objects:  87% (397/456)
Receiving objects:  88% (402/456)
Receiving objects:  89% (406/456)
Receiving objects:  90% (411/456)
Receiving objects:  91% (415/456)
Receiving objects:  92% (420/456)
Receiving objects:  93% (425/456)
Receiving objects:  94% (429/456)
Receiving objects:  95% (434/456)
remote: Total 456 (delta 285), reused 272 (delta 168), pack-reused 0[K
Receiving objects:  96% (438/456)
Receiving objects:  97% (443/456)
Receiving objects:  98% (447/456)
Receiving objects:  99% (452/456)
Receiving objects: 100% (456/456)
Receiving objects: 100% (456/456), 316.69 KiB | 5.56 MiB/s, done.
Resolving deltas:   0% (0/285)
Resolving deltas:   1% (3/285)
Resolving deltas:  10% (29/285)
Resolving deltas:  25% (73/285)
Resolving deltas:  32% (93/285)
Resolving deltas:  33% (95/285)
Resolving deltas:  35% (100/285)
Resolving deltas:  51% (146/285)
Resolving deltas:  52% (149/285)
Resolving deltas:  56% (160/285)
Resolving deltas:  57% (163/285)
Resolving deltas:  58% (166/285)
Resolving deltas:  59% (170/285)
Resolving deltas:  60% (171/285)
Resolving deltas:  61% (176/285)
Resolving deltas:  71% (204/285)
Resolving deltas:  75% (215/285)
Resolving deltas:  76% (217/285)
Resolving deltas:  77% (220/285)
Resolving deltas:  78% (223/285)
Resolving deltas:  81% (231/285)
Resolving deltas:  82% (235/285)
Resolving deltas:  85% (244/285)
Resolving deltas:  87% (248/285)
Resolving deltas:  88% (251/285)
Resolving deltas:  89% (256/285)
Resolving deltas:  94% (268/285)
Resolving deltas:  95% (271/285)
Resolving deltas:  96% (274/285)
Resolving deltas: 100% (285/285)
Resolving deltas: 100% (285/285), done.
travis_time:end:02d3c708:start=1635380577603061525,finish=1635380578188654018,duration=585592493,event=checkout
[0K$ cd mapbox/mapbox-sdk-js
travis_time:start:2dbc1568
[0K$ git fetch origin +refs/pull/430/merge:
remote: Enumerating objects: 9, done.[K
remote: Counting objects:  11% (1/9)[K
remote: Counting objects:  22% (2/9)[K
remote: Counting objects:  33% (3/9)[K
remote: Counting objects:  44% (4/9)[K
remote: Counting objects:  55% (5/9)[K
remote: Counting objects:  66% (6/9)[K
remote: Counting objects:  77% (7/9)[K
remote: Counting objects:  88% (8/9)[K
remote: Counting objects: 100% (9/9)[K
remote: Counting objects: 100% (9/9), done.[K
remote: Compressing objects:  25% (1/4)[K
remote: Compressing objects:  50% (2/4)[K
remote: Compressing objects:  75% (3/4)[K
remote: Compressing objects: 100% (4/4)[K
remote: Compressing objects: 100% (4/4), done.[K
remote: Total 4 (delta 1), reused 0 (delta 0), pack-reused 0[K
Unpacking objects:  25% (1/4)
Unpacking objects:  50% (2/4)
Unpacking objects:  75% (3/4)
Unpacking objects: 100% (4/4)
Unpacking objects: 100% (4/4), 1.68 KiB | 1.68 MiB/s, done.
From https://github.com/mapbox/mapbox-sdk-js
 * branch            refs/pull/430/merge -> FETCH_HEAD
travis_time:end:2dbc1568:start=1635380578192628856,finish=1635380578566320926,duration=373692070,event=checkout
[0K$ git checkout -qf FETCH_HEAD
travis_fold:end:git.checkout
[0K
travis_time:end:2dbc1568:start=1635380578192628856,finish=1635380578578083172,duration=385454316,event=checkout
[0Ktravis_time:start:0643280d
[0Ktravis_time:end:0643280d:start=1635380578581288281,finish=1635380578587292450,duration=6004169,event=env
[0Ktravis_fold:start:nvm.install
[0Ktravis_time:start:119a7278
[0K$ nvm install 12
curl: (60) server certificate verification failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none
More details here: http://curl.haxx.se/docs/sslcerts.html

curl performs SSL certificate verification by default, using a "bundle"
 of Certificate Authority (CA) public keys (CA certs). If the default
 bundle file isn't adequate, you can specify an alternate file
 using the --cacert option.
If this HTTPS server uses a certificate signed by a CA represented in
 the bundle, the certificate verification probably failed due to a
 problem with the certificate (it might be expired, or the name might
 not match the domain name in the URL).
If you'd like to turn off curl's verification of the certificate, use
 the -k (or --insecure) option.
Downloading and installing node v12.22.7...
Downloading https://nodejs.org/dist/v12.22.7/node-v12.22.7-linux-x64.tar.xz...
Computing checksum with sha256sum
Checksums matched!
Now using node v12.22.7 (npm v6.14.15)
travis_time:end:119a7278:start=1635380578875772923,finish=1635380581732123631,duration=2856350708,event=setup
[0Ktravis_fold:end:nvm.install
[0K
travis_fold:start:cache.1
[0KSetting up build cache
$ export CASHER_DIR=${TRAVIS_HOME}/.casher
travis_time:start:089f0872
[0K$ Installing caching utilities
travis_time:end:089f0872:start=1635380582770278409,finish=1635380582830428004,duration=60149595,event=setup_casher
[0Ktravis_time:start:0baf2f58
[0Ktravis_time:end:0baf2f58:start=1635380582835500548,finish=1635380582838301003,duration=2800455,event=setup_casher
[0Ktravis_time:start:00253070
[0Kattempting to download cache archive[0m
[32;1mfetching PR.430/cache--linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-12.tgz[0m
[32;1mfetching PR.430/cache-linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-12.tgz[0m
[32;1mfetching PR.430/cache--node-12.tgz[0m
[32;1mfetching main/cache--linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-12.tgz[0m
[32;1mfound cache[0m
travis_time:end:00253070:start=1635380582841787266,finish=1635380584926986776,duration=2085199510,event=setup_casher
[0Ktravis_time:start:13c52d60
[0Ktravis_time:end:13c52d60:start=1635380584930761199,finish=1635380584933486135,duration=2724936,event=setup_casher
[0Ktravis_time:start:195e6b22
[0Kadding /home/travis/build/mapbox/mapbox-sdk-js/node_modules to cache[0m
creating directory /home/travis/build/mapbox/mapbox-sdk-js/node_modules[0m
travis_time:end:195e6b22:start=1635380584936868788,finish=1635380588040387683,duration=3103518895,event=setup_casher
[0Ktravis_fold:end:cache.1
[0K
travis_fold:start:cache.npm
[0K
travis_time:start:06de04aa
[0Ktravis_time:end:06de04aa:start=1635380588202688389,finish=1635380588205453051,duration=2764662,event=setup_cache
[0Ktravis_time:start:01a7648c
[0Kadding /home/travis/.npm to cache[0m
travis_time:end:01a7648c:start=1635380588209080466,finish=1635380591201858474,duration=2992778008,event=setup_cache
[0Ktravis_fold:end:cache.npm
[0K$ node --version
v12.22.7
$ npm --version
6.14.15
$ nvm --version
0.38.0

travis_fold:start:install.npm
[0Ktravis_time:start:07d1deb6
[0K$ npm ci 
[37;40mnpm[0m [0m[30;43mWARN[0m [0m[35mprepare[0m removing existing node_modules/ before installation
[0m
> fsevents@1.2.3 install /home/travis/build/mapbox/mapbox-sdk-js/node_modules/fsevents
> node install


> husky@0.14.3 install /home/travis/build/mapbox/mapbox-sdk-js/node_modules/husky
> node ./bin/install.js

husky
CI detected, skipping Git hooks installation

> parse-domain@2.1.1 postinstall /home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain
> node scripts/build-tries.js

Downloading public suffix list from https://publicsuffix.org/list/public_suffix_list.dat... ok
Writing /home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/icann.complete.json... ok
Writing /home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/icann.light.json... ok
Writing /home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/private.complete.json... ok
Running sanity check... ok
added 1504 packages in 11.358s
travis_time:end:07d1deb6:start=1635380591998913447,finish=1635380603709011121,duration=11710097674,event=install
[0Ktravis_fold:end:install.npm
[0K
travis_time:start:1791ce54
[0K$ npm run test

> @mapbox/mapbox-sdk@0.13.2 pretest /home/travis/build/mapbox/mapbox-sdk-js
> npm run lint


> @mapbox/mapbox-sdk@0.13.2 lint /home/travis/build/mapbox/mapbox-sdk-js
> run-p --aggregate-output lint-md lint-js


> @mapbox/mapbox-sdk@0.13.2 lint-md /home/travis/build/mapbox/mapbox-sdk-js
> remark-preset-davidtheclark


> @mapbox/mapbox-sdk@0.13.2 lint-js /home/travis/build/mapbox/mapbox-sdk-js
> eslint .


> @mapbox/mapbox-sdk@0.13.2 test /home/travis/build/mapbox/mapbox-sdk-js
> jest

[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mstatic.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mtilesets.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mstyles.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/classes/__tests__/[22m[1mmapi-request.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mtokens.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mdatasets.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1moptimization.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/helpers/__tests__/[22m[1mparse-link-header.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mmap-matching.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mdirections.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mmatrix.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/classes/__tests__/[22m[1mmapi-error.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/helpers/__tests__/[22m[1murl-utils.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1misochrone.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/classes/__tests__/[22m[1mmapi-response.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/browser/__tests__/[22m[1mbrowser-layer.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mgeocoding.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1muploads.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mtest/[22m[1mbrowser-interface.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mtest/[22m[1mnode-interface.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/service-helpers/__tests__/[22m[1mvalidator.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/classes/__tests__/[22m[1mmapi-client.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/__tests__/[22m[1mtilequery.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mservices/service-helpers/__tests__/[22m[1mvalidator-browser.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mlib/helpers/__tests__/[22m[1mparse-headers.test.js[22m
[0m[7m[1m[32m PASS [39m[22m[27m[0m [2mtest/[22m[1mbundle.test.js[22m
[999D[K
[1mTest Suites: [22m[1m[32m26 passed[39m[22m, 26 total
[1mTests:       [22m[1m[32m430 passed[39m[22m, 430 total
[1mSnapshots:   [22m0 total
[1mTime:[22m        3.627s
[2mRan all test suites[22m[2m.[22m
travis_time:end:1791ce54:start=1635380603713904058,finish=1635380610944326387,duration=7230422329,event=script
[0K[32;1mThe command "npm run test" exited with 0.[0m
travis_time:start:07d04906
[0K$ npm run bundle

> @mapbox/mapbox-sdk@0.13.2 bundle /home/travis/build/mapbox/mapbox-sdk-js
> rollup --config ./rollup.config.js && uglifyjs umd/mapbox-sdk.js > umd/mapbox-sdk.min.js

[36m[39m
[36m[1m/home/travis/build/mapbox/mapbox-sdk-js/bundle.js[22m â†’ [1mumd/mapbox-sdk.js[22m...[39m
[32mcreated [1mumd/mapbox-sdk.js[22m in [1m619ms[22m[39m
travis_time:end:07d04906:start=1635380610948413276,finish=1635380612130700772,duration=1182287496,event=script
[0K[32;1mThe command "npm run bundle" exited with 0.[0m
travis_fold:start:cache.2
[0Kstore build cache
travis_time:start:01e49d18
[0Ktravis_time:end:01e49d18:start=1635380612135304675,finish=1635380612138142696,duration=2838021,event=cache
[0Ktravis_time:start:043dfa78
[0K[32;1mchanges detected (content changed, file is created, or file is deleted):\n/home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/icann.complete.json
/home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/icann.light.json
/home/travis/build/mapbox/mapbox-sdk-js/node_modules/parse-domain/build/tries/current/private.complete.json\n[0m
[32;1mchanges detected, packing new archive[0m
[32;1muploading PR.430/cache--linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-12.tgz[0m
[32;1mcache uploaded[0m
travis_time:end:043dfa78:start=1635380612141731777,finish=1635380618562529424,duration=6420797647,event=cache
[0Ktravis_fold:end:cache.2
[0K

Done. Your build exited with 0.
