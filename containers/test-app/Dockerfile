FROM debian:jessie

LABEL io.aegir.app.enabled="1"
LABEL io.aegir.app.name="Test App"
LABEL io.aegir.app.description="A simple Aegir app for test purpose"

# App variables

# "Message" variable
LABEL io.aegir.app.vars.message.label="Message"
LABEL io.aegir.app.vars.message.description="A basic message to print"
LABEL io.aegir.app.vars.message.type="text"
LABEL io.aegir.app.vars.message.defaultValue="Hello world !"
LABEL io.aegir.app.vars.message.env="MY_MESSAGE"

EXPOSE 80
VOLUME /test

CMD while true; do echo $MY_MESSAGE; sleep 2; done;
