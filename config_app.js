// 1. CONFIGURATION GÉNÉRALE DU SITE
// C'est ici que vous changez le nom de votre application et le menu principal.
const APP_CONFIG = {
    title: "France 24", // Le titre qui s'affiche partout
    db_name: "Revue_de_Presse",    // Le nom technique de votre base de données
    page_details: "form.html", // Le moule utilisé par défaut pour les formulaires (si non précisé dans config_pages.js)
    menu: [
        // Chaque ligne ici crée un bouton dans le menu de gauche.
        // label: le texte affiché, url: le nom du fichier vers lequel aller.
        { label: "🏠 Accueil", url: "index.html" },
        { label: "📋 Gérer les Consultations", url: "list_consultations.html" },
        { label: "📋 Gérer les Articles", url: "list_articles.html" },
        { label: "📋 Gérer les Auteurs", url: "list_auteurs.html" },
        { label: "📋 Gérer les Editions", url: "list_editions.html" },
        { label: "🔗 Consultations (avec Noms)", url: "list_with_join_consultations.html" },
        { label: "🔗 Articles (avec Noms)", url: "list_with_join_articles.html" },
        { label: "📊 Statistique de Langue", url: "stats_langue.html" },
        { label: "📊 Statistique des Auteurs", url: "stats_auteurs.html" },
        { label: "📊 Statistique des Consultations", url: "stats_consultations.html" },
        { label: "📜 Historique complet", url: "TEMPLATE_vue_complexe.html" }
    ]
};
