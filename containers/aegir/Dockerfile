FROM debian:jessie

MAINTAINER William Petit <wpetit@cadoles.com>

#ENV http_proxy "http://192.168.10.254:3128"
#ENV https_proxy "http://192.168.10.254:3128"

RUN apt-get update &&\
  apt-get install --no-install-recommends --yes ca-certificates curl

RUN curl --silent --location https://deb.nodesource.com/setup_4.x | /usr/bin/env bash -

RUN apt-get install --yes --no-install-recommends nodejs

RUN mkdir -p /opt/aegir

WORKDIR /opt/aegir

ADD run.sh /usr/local/bin/aegir

RUN chmod +x /usr/local/bin/aegir

CMD ["/usr/local/bin/aegir"]
