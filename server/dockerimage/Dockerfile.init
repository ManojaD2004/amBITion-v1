FROM ubuntu:22.04

RUN apt update -y && apt upgrade -y
RUN apt install git -y

WORKDIR /src

RUN apt install openssh-server -y

ARG username=admin
ARG password=1234

RUN useradd -m -s /bin/bash ${username}
RUN echo "${username}:${password}" | chpasswd

EXPOSE 22

CMD service ssh start && bash