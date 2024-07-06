FROM ubuntu:22.04

RUN apt update -y && apt upgrade -y
RUN apt install git -y

WORKDIR /src

RUN apt install openssh-server -y

ARG username=admin
ARG password=1234

RUN apt-get -y install sudo
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_22.x  | bash -
RUN apt-get -y install nodejs


RUN useradd -m -d /home/${username} -s /bin/bash ${username}
RUN echo "${username}:${password}" | chpasswd
RUN chown -R ${username}:${username} /src
RUN chown -R ${username}:${username} /home/${username}

EXPOSE 22

CMD service ssh start && bash