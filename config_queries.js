// 2. CATALOGUE DE REQUÊTES SQL
// Adapté au MCD de la Revue de Presse (France 24)

const SQL_QUERIES = {
    setup: { 
        get_status: 'SELECT VALUE initialise FROM setup WHERE id = 1' 
    },
    
    // --- AUTEURS ---
    auteurs: {
        list_all: "SELECT * FROM auteurs",
        get_one: "SELECT * FROM auteurs WHERE id = ?",
        insert: "INSERT INTO auteurs (nom, prenom, emplois) VALUES (?, ?, ?)",
        update: "UPDATE auteurs SET nom = ?, prenom = ?, emplois = ? WHERE id = ?",
        delete: "DELETE FROM auteurs WHERE id = ?",
        select_options: "SELECT id AS option_value, nom AS option_text FROM auteurs"
    },

    // --- ARTICLES ---
    articles: {
        list_all: "SELECT * FROM articles",
        // Sélectionne les articles dont la date de sortie est passée ou d'aujourd'hui
        list_all_currently_active: "SELECT * FROM articles WHERE date_sortie <= CURDATE()",
        
        // Jointure (1,1) avec la table Rubrique pour afficher le nom de la rubrique au lieu de son ID
        list_with_names: "SELECT a.id, a.titre, a.date_sortie, a.langue, r.nom_rubrique AS rubrique FROM articles a JOIN rubrique r ON a.rubrique_id = r.id",
        
        get_one: "SELECT * FROM articles WHERE id = ?",
        insert: "INSERT INTO articles (titre, date_sortie, langue, rubrique_id) VALUES (?, ?, ?, ?)",
        update: "UPDATE articles SET titre = ?, date_sortie = ?, langue = ?, rubrique_id = ? WHERE id = ?",
        delete: "DELETE FROM articles WHERE id = ?",
        select_options: "SELECT id AS option_value, titre AS option_text FROM articles"
    },

    // --- EDITIONS ---
    editions: {
        list_all: "SELECT * FROM editions",
        get_one: "SELECT * FROM editions WHERE id = ?",
        insert: "INSERT INTO editions (nom) VALUES (?)",
        update: "UPDATE editions SET nom = ? WHERE id = ?",
        delete: "DELETE FROM editions WHERE id = ?"
    },

    // --- CONSULTATIONS (Table a_consulte) ---
    a_consulte: {
        list_all: "SELECT * FROM a_consulte",
        
        // Triple jointure pour afficher le nom de l'article et le pseudo de l'utilisateur
        list_with_names: "SELECT c.id, u.pseudo AS lecteur, a.titre AS article, c.nbr_consultations, c.tps_moyen FROM a_consulte c JOIN utilisateur u ON c.utilisateur_id = u.id JOIN articles a ON c.article_id = a.id",
        
        get_one: "SELECT * FROM a_consulte WHERE id = ?",
        insert: "INSERT INTO a_consulte (utilisateur_id, article_id, nbr_consultations, tps_moyen) VALUES (?, ?, ?, ?)",
        update: "UPDATE a_consulte SET utilisateur_id = ?, article_id = ?, nbr_consultations = ?, tps_moyen = ? WHERE id = ?",
        delete: "DELETE FROM a_consulte WHERE id = ?"
    },

    // --- STATISTIQUES ---
    stats: {
        // répartition par langue
        articles_par_langue: "SELECT langue AS Langue, COUNT(*) AS nb FROM articles GROUP BY langue",
        
        // nombre d'articles par auteur (utilise la table de liaison travaille_sur)
        top_auteurs: "SELECT au.nom, COUNT(*) AS nb FROM travaille_sur ts JOIN auteurs au ON ts.auteur_id = au.id GROUP BY au.nom ORDER BY nb DESC",
        
        // consultation des articles
        consultations_par_article: "SELECT a.titre AS article, SUM(c.nbr_consultations) AS nb FROM a_consulte c JOIN articles a ON c.article_id = a.id GROUP BY a.titre ORDER BY nb DESC"
    },

    // --- VUE COMPLEXE (Historique) ---
    historique: {
        vue_globale: `
            SELECT 
                u.pseudo AS Lecteur, 
                u.pays AS Pays,
                a.titre AS Article, 
                r.nom_rubrique AS Rubrique, 
                c.nbr_consultations AS Vues
            FROM a_consulte c 
            JOIN utilisateur u ON c.utilisateur_id = u.id 
            JOIN articles a ON c.article_id = a.id
            JOIN rubrique r ON a.rubrique_id = r.id
            ORDER BY c.nbr_consultations DESC
        `
    }
};