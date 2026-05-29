const INIT_DB_SQL = `
-- 1. Table de statut pour le moteur
CREATE TABLE IF NOT EXISTS setup (id INT, initialise BOOLEAN);
INSERT INTO setup VALUES (1, true);

-- 2. TABLES PRINCIPALES

CREATE TABLE IF NOT EXISTS journal (id INT AUTO_INCREMENT, date_sortie DATE, type STRING);
CREATE TABLE IF NOT EXISTS editions (id INT AUTO_INCREMENT, nom STRING);
CREATE TABLE IF NOT EXISTS utilisateur (id INT AUTO_INCREMENT, pseudo STRING, pays STRING);
CREATE TABLE IF NOT EXISTS rubrique (id INT AUTO_INCREMENT, nom_rubrique STRING, nbr_consultations INT);
CREATE TABLE IF NOT EXISTS auteurs (id INT AUTO_INCREMENT, nom STRING, prenom STRING, emplois STRING);
CREATE TABLE IF NOT EXISTS articles (id INT AUTO_INCREMENT, titre STRING, date_sortie DATE, langue STRING, rubrique_id INT);

CREATE TABLE IF NOT EXISTS publie (journal_id INT, edition_id INT, nr_publication INT);
CREATE TABLE IF NOT EXISTS ecrit (edition_id INT, article_id INT);
CREATE TABLE IF NOT EXISTS abonne_a (utilisateur_id INT, journal_id INT, nr_abonnement INT, type STRING);
CREATE TABLE IF NOT EXISTS prefere (utilisateur_id INT, rubrique_id INT);
CREATE TABLE IF NOT EXISTS travaille_sur (article_id INT, auteur_id INT, role STRING, temps FLOAT);
CREATE TABLE IF NOT EXISTS a_consulte (id INT AUTO_INCREMENT, utilisateur_id INT, article_id INT, nbr_consultations INT, tps_moyen FLOAT);

INSERT INTO rubrique (nom_rubrique, nbr_consultations) VALUES ('Politique Internationale', 15000);
INSERT INTO rubrique (nom_rubrique, nbr_consultations) VALUES ('Economie et Tech', 8500);

INSERT INTO auteurs (nom, prenom, emplois) VALUES ('Dupont', 'Jean', 'Grand Reporter');
INSERT INTO auteurs (nom, prenom, emplois) VALUES ('Smith', 'Alice', 'Correspondante Washington');

INSERT INTO articles (titre, date_sortie, langue, rubrique_id) VALUES ('Le sommet europeen face a la crise', '2026-05-15', 'FR', 1);
INSERT INTO articles (titre, date_sortie, langue, rubrique_id) VALUES ('La montee en fleche de IA', '2026-05-16', 'EN', 2);
INSERT INTO articles (titre, date_sortie, langue, rubrique_id) VALUES ('Elections anticipees le grand enjeu', '2026-05-17', 'FR', 1);

INSERT INTO utilisateur (pseudo, pays) VALUES ('NewsJunkie99', 'France');
INSERT INTO utilisateur (pseudo, pays) VALUES ('GlobalCitizen', 'Canada');

INSERT INTO editions (nom) VALUES ('Edition Matinale');
INSERT INTO editions (nom) VALUES ('Edition Soir / Debat');
INSERT INTO journal (date_sortie, type) VALUES ('2026-05-15', 'Quotidien');

INSERT INTO travaille_sur (article_id, auteur_id, role, temps) VALUES (1, 1, 'Redacteur en chef', 15.5);
INSERT INTO travaille_sur (article_id, auteur_id, role, temps) VALUES (2, 2, 'Enqueteur', 24.0);

INSERT INTO a_consulte (utilisateur_id, article_id, nbr_consultations, tps_moyen) VALUES (1, 1, 3, 120.5);
INSERT INTO a_consulte (utilisateur_id, article_id, nbr_consultations, tps_moyen) VALUES (1, 2, 1, 45.0);
INSERT INTO a_consulte (utilisateur_id, article_id, nbr_consultations, tps_moyen) VALUES (2, 1, 5, 210.0);
`;