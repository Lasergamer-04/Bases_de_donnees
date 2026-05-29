// 3. CONFIGURATION DES PAGES (Adapté pour France 24)
const PAGES_CONFIG = {
    // --- PAGES DE TYPE "LISTE" (Tableaux) ---
    "articles_liste": {
        title: "Gestion des Articles",
        table_name: "article",
        query: SQL_QUERIES.articles.list_all_currently_active,
        delete_query: SQL_QUERIES.articles.delete,
        form_page_url: "form_article.html" 
    }, 
    "auteurs_liste": {
        title: "Gestion des Auteurs",
        table_name: "auteur",
        query: SQL_QUERIES.auteurs.list_all,
        delete_query: SQL_QUERIES.auteurs.delete,
        form_page_url: "form_auteur.html"
    }, 
    "editions_liste": {
        title: "Gestion des Editeurs",
        table_name: "edition",
        query: SQL_QUERIES.editions.list_all,
        delete_query: SQL_QUERIES.editions.delete,
        form_page_url: "form_edition.html"
    }, 
    "consultations_liste": {
        title: "Gestion des Consultations",
        table_name: "a_consulte",
        query: SQL_QUERIES.a_consulte.list_all,
        delete_query: SQL_QUERIES.a_consulte.delete,
        form_page_url: "form_consultation.html"
    },
    
    // --- VUES AVEC JOINTURES ---
    "article_liste_join": {
        title: "Articles (Vue avec Rubriques)",
        table_name: "article",
        query: SQL_QUERIES.articles.list_with_names,
        delete_query: SQL_QUERIES.articles.delete,
        form_page_url: "form_jointure_article.html"
    }, 
    "consultations_liste_join": {
        title: "Consultations (Vue détaillée)",
        table_name: "a_consulte",
        query: SQL_QUERIES.a_consulte.list_with_names,
        delete_query: SQL_QUERIES.a_consulte.delete,
        form_page_url: "form_jointure_consultation.html"
    },

    // --- PAGES DE TYPE "STATISTIQUES" (Graphiques) ---
    "stats_langue": {
        title: "Statistiques des Langues", 
        charts: [
            { id: "chartLangues", type: "pie", title: "Répartition par Langue", query: SQL_QUERIES.stats.articles_par_langue, label_col: "Langue", value_col: "nb" }
        ]
    },
    "stats_auteurs": {
        title: "Statistiques des Auteurs", 
        charts: [
            { id: "chartAuteurs", type: "bar", title: "Articles par Auteur", query: SQL_QUERIES.stats.top_auteurs, label_col: "nom", value_col: "nb" }
        ]
    },
    "stats_consultations": {
        title: "Popularité des Articles", 
        charts: [
            { 
                id: "chartPopularite", 
                type: "bar", 
                title: "Vues Totales par Article", 
                query: SQL_QUERIES.stats.consultations_par_article, 
                label_col: "article", 
                value_col: "nb" 
            }
        ]
    },

    // --- FORMULAIRES DE SAISIE ---
    "formulaire_article": {
        title: "Fiche Article",
        table_name: "article",
        fields: [
            { name: "titre", label: "Titre de l'article", type: "text" },
            { name: "date_sortie", label: "Date de sortie", type: "date" },
            { name: "langue", label: "Langue (FR, EN...)", type: "text" },
            { name: "rubrique_id", label: "ID de la rubrique (ex: 1 ou 2)", type: "number" }
        ],
        query_get_one: SQL_QUERIES.articles.get_one,
        query_insert: SQL_QUERIES.articles.insert,
        query_update: SQL_QUERIES.articles.update
    },
    "formulaire_auteur": {
        title: "Fiche Auteur",
        table_name: "auteur",
        fields: [
            { name: "nom", label: "Nom", type: "text" },
            { name: "prenom", label: "Prénom", type: "text" },
            { name: "emplois", label: "Poste/Emploi", type: "text" }
        ],
        query_get_one: SQL_QUERIES.auteurs.get_one,
        query_insert: SQL_QUERIES.auteurs.insert,
        query_update: SQL_QUERIES.auteurs.update
    },
    "formulaire_edition": {
        title: "Édition",
        table_name: "editions",
        fields: [
            { name: "nom", label: "Nom de l'édition (ex: Édition Spéciale)", type: "text" }
        ],
        query_get_one: SQL_QUERIES.editions.get_one,
        query_insert: SQL_QUERIES.editions.insert,
        query_update: SQL_QUERIES.editions.update
    },
    "formulaire_consultation": {
        title: "Consultation",
        table_name: "a_consulte",
        fields: [
            // Utilisation du type "select" pour générer automatiquement des listes déroulantes dynamiques !
            { name: "utilisateur_id", label: "Lecteur / Utilisateur", type: "select", query_options: "SELECT id AS option_value, pseudo AS option_text FROM utilisateur" },
            { name: "article_id", label: "Article consulté", type: "select", query_options: "SELECT id AS option_value, titre AS option_text FROM articles" },
            { name: "nbr_consultations", label: "Nombre de consultations", type: "number" },
            { name: "tps_moyen", label: "Temps moyen passé (en secondes)", type: "number" }
        ],
        query_get_one: SQL_QUERIES.a_consulte.get_one,
        query_insert: SQL_QUERIES.a_consulte.insert,
        query_update: SQL_QUERIES.a_consulte.update
    },

    // --- VUE HISTORIQUE ---
    "vue_historique": {
        title: "Historique Complet des Consultations",
        query: SQL_QUERIES.historique.vue_globale
    }
};