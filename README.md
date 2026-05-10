# Tableau Kanban — README

## Présentation

Application web de gestion de tâches de type **Kanban**, permettant d'organiser des cartes dans trois colonnes : **À faire**, **En cours** et **Terminé**. Les données sont persistées via une API REST locale (json-server).

---

## Fonctionnement général

### Architecture

L'application repose sur trois couches bien séparées :

- **`index.html`** — Structure de la page : trois colonnes Kanban, un dialog modal pour créer/modifier une tâche.
- **`css/style.css`** — Mise en forme : disposition en colonnes flexibles, cartes, boutons, dialog.
- **`js/main.js`** — Point d'entrée : initialise l'application en appelant `initTasks()`.
- **`js/crud.js`** — Logique métier et manipulation du DOM : affichage, création, suppression et modification des tâches.
- **`js/data-access.js`** — Couche d'accès aux données : communication avec l'API REST via `fetch`.
- **`db.json`** — Base de données JSON utilisée par json-server.

### Lancement

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Démarrer json-server (port 3000 par défaut) :
   ```bash
   npx json-server db.json
   ```
3. Ouvrir `index.html` dans un navigateur (ou via un serveur local type Live Server).

### Flux de données

```
Utilisateur
    │
    ▼
crud.js (DOM)
    │
    ▼
data-access.js (fetch)
    │
    ▼
json-server → db.json
```

Au chargement, `getTasks()` récupère toutes les tâches depuis l'API et les répartit dans les bonnes colonnes selon leur champ `list` (`"todo"`, `"doing"` ou `"done"`), triées par `priority`.


## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| Affichage des tâches | Les tâches sont chargées depuis l'API au démarrage et classées par colonne |
| Création | Clic sur "+ Ajouter une carte" → ouverture d'un dialog modal avec titre et description |
| Modification | Bouton "Modifier" sur une carte → le dialog se pré-remplit avec les données existantes |
| Suppression | Bouton "Supprimer" sur une carte → suppression côté DOM et côté API |
| Compteurs | Chaque colonne affiche le nombre de tâches qu'elle contient, mis à jour dynamiquement |


## Choix techniques

### Séparation des responsabilités (SoC)

Le code est divisé en deux modules JavaScript distincts (`crud.js` et `data-access.js`) pour séparer la logique d'affichage/interaction de la logique d'accès réseau. Cela facilite la maintenance et les tests.

### Modules ES (`type="module"`)

Les fichiers JS utilisent la syntaxe `import`/`export` native du navigateur, évitant tout bundler (Webpack, Vite, etc.) pour rester simple et lisible.

### `<dialog>` natif HTML

Le formulaire de création/modification utilise l'élément `<dialog>` du navigateur plutôt qu'une modale custom en CSS.

### json-server comme backend

json-server permet de simuler une API REST complète (GET, POST, PUT, DELETE) à partir d'un simple fichier `db.json`, sans avoir à écrire de code serveur. Idéal pour un projet front-end ou un prototype.

### Priorité des tâches

À la création, une tâche reçoit automatiquement une priorité égale à `nombre de tâches dans la colonne + 1`, garantissant qu'elle apparaît en dernier dans la liste.

## Structure des fichiers

```
projet/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── crud.js
│   └── data-access.js
│   └── drag.js
├── index.html
├── db.json
├── README.md
└── JOURNAL.md
```

---

## Modèle de données (tâche)

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "list": "todo | doing | done",
  "priority": "number"
}
```
