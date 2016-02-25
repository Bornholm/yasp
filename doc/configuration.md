# Configuration

## Personnalisation

Yasp utilise le module [rc](https://www.npmjs.com/package/rc) afin de gérer sa configuration. La configuration par défaut est visible dans le fichier `lib/server/config.js`.

Vous pouvez créer un fichier `.yasprc` à la racine du répertoire de l'application afin de personnaliser le paramétrage de votre instance de Yasp. Ce fichier au format JSON vous permet de surcharger finement les éléments que vous souhaitez modifier.

D'autres possibilités sont offertes, voir la documentation du module rc pour plus d'informations.

## Gestion des comptes

### Compte par défaut

Yasp fournit un compte par défaut pour le développement. **Celui ci devrait être modifié/supprimé pour toute autre type d'usage**.

Les identifiants pour ce compte sont:

- **Login:** admin
- **Mot de passe:** yasp

### Création/modification des comptes

Les comptes autorisés à se connecter à l'interface de Yasp et à utiliser l'API sont directement renseignés dans le fichier de configuration dans la section `auth.users`, sous la forme d'un couple `identifiant/hachage du mot de passe`.

Afin de générer un hachage compatible avec Yasp, vous pouvez utiliser la commande suivante habituellement disponible sur les systèmes GNU/Linux:

```bash
mkpasswd -m sha-512 <password>
```
L'utilisation de l'algorithme `sha-512` est **obligatoire**.
