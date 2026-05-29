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
        // Tu pourras créer form_edition.html plus tard
    }, 
    "consultations_liste": {
        title: "Gestion des Consultations",
        table_name: "a_consulte",
        query: SQL_QUERIES.a_consulte.list_all,
        delete_query: SQL_QUERIES.a_consulte.delete,
        // Tu pourras créer form_consultation.html plus tard
    },
    
    // --- VUES AVEC JOINTURES ---
    "article_liste_join": {
        title: "Articles (Vue avec Rubriques)",
        table_name: "article",
        query: SQL_QUERIES.articles.list_with_names,
        delete_query: SQL_QUERIES.articles.delete,
    }, 
    "consultations_liste_join": {
        title: "Consultations (Vue détaillée)",
        table_name: "a_consulte",
        query: SQL_QUERIES.a_consulte.list_with_names,
        delete_query: SQL_QUERIES.a_consulte.delete,
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
    }
};