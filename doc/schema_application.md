# Les schémas d'application

Dans l'absolu, Yasp n'est qu'une interface de haut niveau pour utiliser le service Docker et un schéma d'application n'est qu'une image de conteneur suivant quelques conventions. C'est à dire que si vous savez écrire un fichier Dockerfile, vous savez créer un schéma d'application pour Yasp.

Nous ne ferons pas ici l'explication de la création d'une image Docker à partir d'un fichier Dockerfile. Vous pouvez vous rendre sur [le site de Docker](https://docs.docker.com/engine/reference/builder/) pour en apprendre plus à ce sujet.

Nous aborderons plutôt comment nous pouvons modifier un fichier Dockerfile existant afin de le rendre "compatible" Yasp.

## Rappel du contexte

### Les labels dans Docker

Docker permet d'associer des métadonnées à ses images sous la forme de ["labels"](https://docs.docker.com/engine/userguide/labels-custom-metadata/).

Yasp utilise cette fonctionnalité afin de clarifier les attentes de l'image en terme de variables de configuration et ainsi fournir une interface graphique d'instanciation de conteneurs. Outre l'accessibilité apportée, cet "agent intermédiaire" qu'est Yasp permet de valider le type et les valeurs des variables limitant de fait les possibilités d'erreurs de configuration.

### Configuration via les variables d'environnement

Une des conventions fortement ancrée dans la communauté Docker est l'utilisation de variables d'environnement afin de personnaliser le comportement du conteneur instancié.
Yasp suit également cette convention pour configurer ses applications.

Un des principaux avantages à suivre celle ci est que les applications Yasp ne sont, pour la plupart, pas dépendantes du contexte Yasp i.e. vos images Yasp peuvent être testées/validées/utilisées comme des images Docker classiques.

## Un fichier Dockerfile "Yasp-compatible"

Voici un exemple de fichier Dockerfile commenté, compatible avec Yasp:

```dockerfile

FROM debian:jessie


```
## Labels Yasp

Tous les labels Yasp sont préfixés par `io.yasp` pour définir un espace de nom propre à Yasp. Ce préfixe est omis dans la liste suivante par soucis de lisibilité.

### app.enabled

- **Valeurs possibles** `1` | `0`
- **Valeur par défaut**: `0`





