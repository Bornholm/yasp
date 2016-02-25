# YASP <small>*Yet Another Side Project</small>

Système de déploiement/gestion de services/applications basé sur Docker (et quelques conventions).

## Dépendances

- [Docker](https://www.docker.com/) - Testé avec la version 1.9.1
- [NodeJS](https://nodejs.org/en/) - Testé avec la version 5.1.0

## Démarrer avec les sources

```bash
git clone -b develop --recursive https://github.com/Bornholm/yasp yasp
cd yasp
npm install # Installer les dépendances NodeJS
./apps/build-all.sh # "Construire" les images des apps Yasp
npm run watch
```

## Documentation

Voir le répertoire [doc](./doc).

## Licence

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
