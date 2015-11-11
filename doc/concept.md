# Aegir (working title)


- Besoin de solution d'auto-hébergement simple d'accès comme Yunohost (installation en 1 clic, SSO par défaut)
- Le packaging des applications doit être simple
- La sauvegarde/restauration des données doit être prises en compte dès le départ
- Les applications devraient pouvoir être installées /désinstallées sans compromettre le système entier


Proposition:

L'outil de gestion de conteneurs Docker utilise un format Dockerfile pour décrire l'état d'un conteneur et son contenu. Les spécifications Dockerfile permette d'ajouter des métadonnées sous la forme de label https://docs.docker.com/userguide/labels-custom-metadata/

En utilisant ce système nous pourrions définir un ensemble de variables qui permettrait de configurer une application à son lancement, un peu à la manière de GenConfig. Ces variables seront ensuite passées au conteneur à son instanciation via des variables d'environnement http://serverascode.com/2014/05/29/environment-variables-with-docker.html

Exemple de Dockerfile voir https://docs.docker.com/examples/nodejs_web_app/

```bash
  FROM aegir:baseimage

  # Les clés doivent être sous la forme d'une notation DNS inversée.

  # Cette clé indique à Aegir que cette image de conteneur est une application Aegir. La récupération des images du "catalogue" Aegir se fera en filtrant sur la présence de cette clé dans l'image
  LABEL io.aegir.app="1"

  # Clés de description qui serviront à l'affichage du catalogue
  LABEL io.aegir.app.name="My App"
  LABEL io.aegir.app.description="Ma super app qui rend service à tout le monde"

  # Clés définition des variables de configuration du conteneur

  LABEL io.aegir.app.vars.my_var = {"type": "string", required: true, defaultValue: "Foo"}
  LABEL io.aegir.app.vars.my_other_var = {"type": "string", required: true, defaultValue: "Foo"}

  # On indique que l'App a une dépendance envers le services "aegir.databases"
  LABEL io.aegir.app.dependencies = ["aegir.databases"];

  # Directives de création du conteneur
  RUN apt-get update && apt-get install apache2 apache2-mod-php5

  ADD ./run.sh /root/run.sh

  CMD /root/run.sh

```

Fichier run.sh

```
#!/bin/sh

# Le fichier de lancement de l'application recevra en variables d'environnement les variables qu'il aura définit auparavant.
# Ces variables auront été renseignées dans l'interface d'Aegir par l'utilisateur instanciant l'application

echo $AEGIR_VAR_MY_VAR
echo $AEGIR_VAR_MY_OTHER_VAR

# Chaque app recevra également un identifiant unique qui lui permettra de s'identifier avec les services d'Aegir
echo $AEGIR_APPID

# Un des objectifs d'Aegir est d'exposer également certaines "App" en tant que service pour les autres.
# On peut imaginer un service fournissant des BDD par exemple, avec une API REST permettant aux Apps dépendantes d'en créer:

# L'appel à l'API REST du service aegir.databases créera une base de données dans le conteneur de celui ci et renverra les identifiants associés à cette nouvelle base créée spécialement pour l'App
curl -X POST http://database.aegir.lan/rdb?appid=$AEGIR_APPID > /tmp/db.conf

source /tmp/db.conf

echo $DB_HOST
echo $DB_USER
echo $DB_PASSWORD
echo $DB_TYPE
echo $DB_PORT

# Etc

# On peut également imaginer un service de reverse proxy qui permettrait de rediriger automatiquement certaines URL, un service SSO, etc...

# Si on créait une image de base pour les Apps, on peut également imaginer une meilleure intégration des services en proposant un petit utilitaire qui ferait une abstraction, soit à la place du curl précédent:

aegir database create > /tmp/db.conf
source /tmp/db.conf

# etc...

# Lancement du serveur Web
/usr/bin/apache2
```
