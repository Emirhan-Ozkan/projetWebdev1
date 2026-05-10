# JOURNAL.md — Suivi de projet Kanban
## Feuille de route

### Objectif du projet

Développer une application Kanban web en JavaScript vanilla, avec persistance des données via une API REST locale (json-server), sans framework front-end.

## Problèmes rencontrés

### 1. Drag & drop non fonctionnel

**Problème :** Le HTML et le CSS prévoient les attributs `draggable="true"` et les classes `.drop-zone` / `.dragging`, mais les event listeners correspondants (`dragstart`, `dragover`, `drop`, etc.) n'étaient pas implémentés dans `crud.js`.

## Journal de suivi

### Séance 1 — Initialisation du projet

- Création de la structure de fichiers (`index.html`, `css/`, `js/`, `db.json`).
- Mise en place de json-server avec un jeu de données initial.
- Premiers essais avec `fetch` pour récupérer les tâches.

### Séance 2 — Affichage des tâches

- Écriture de `getTasks()` dans `data-access.js`.
- Implémentation de `sortTasks()` et `addTask()` dans `crud.js` pour générer les cartes dans le DOM.
- Mise en place du tri par priorité et du filtrage par colonne.

### Séance 3 — CSS et mise en page

- Intégration du layout Kanban en flexbox.
- Stylisation des cartes (hover, bouton supprimer masqué/visible, drag visuel).
- Intégration des drop-zones et des classes CSS correspondantes.

### Séance 4 — CRUD complet

- Implémentation de la création (`createTask`, `addTaskServer`).
- Implémentation de la suppression (`deleteTask`, `removeTask`).
- Implémentation de la modification (`updateTask`, `saveTask`).
- Tests manuels de chaque opération avec json-server.

### Séance 5 — Migration vers le dialog natif

- Remplacement des formulaires inline par un `<dialog>` unique.
- Adaptation de `crud.js` : gestion de `listConcerned`, `method` (`"create"` / `"update"`), `taskConcerned`.
- Mise en commentaire du CSS des anciens formulaires inline.
- Tests de l'ouverture/fermeture du dialog dans les trois colonnes.

### Séance 6 — Corrections et finalisation

- Implémenter le drag & drop entre colonnes (déplacer une carte change son `list` et son `priority`)
- Vérification du comportement de `deleteTask` (refresh après suppression).
- Nettoyage du code, ajout de commentaires.
- Rédaction du README et du JOURNAL.
