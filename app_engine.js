/** 
 * LOGIQUE GLOBALE DU MOTEUR (À NE PAS TOUCHER PAR LES ÉTUDIANTS)
 */

function highlightSQL(text) {
    if (!text) return "";
    let sql = text.trim();
    if (!sql.endsWith(';') && !sql.startsWith('--')) sql += ';';
    const keywords = ["SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "SET", "DELETE", "JOIN", "ON", "GROUP BY", "ORDER BY", "AS", "VALUES", "LIMIT", "AND", "OR", "COUNT", "SUBSTRING", "CREATE", "TABLE", "IF NOT EXISTS"];
    const newlineKeywords = ["FROM", "JOIN", "GROUP BY", "ORDER BY", "LIMIT"];
    let html = sql;
    newlineKeywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        html = html.replace(regex, `<br>${kw}`);
    });
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        html = html.replace(regex, `<span class="sql-kw">${kw}</span>`);
    });
    return html;
}

// La fonction injectStyles est supprimée car le CSS est maintenant dans style.css
// function injectStyles() { ... }

function connectDB() {
    const dbName = APP_CONFIG.db_name;
    if (alasql.databases[dbName]) { alasql(`USE ${dbName}`); return; }
    
    if (window.location.pathname.endsWith('index.html') && !sessionStorage.getItem('db_choice_made')) {
        localStorage.setItem('db_persistence_enabled', confirm("💾 Activer la sauvegarde permanente ?"));
        sessionStorage.setItem('db_choice_made', 'true');
    }
    
    const usePersist = localStorage.getItem('db_persistence_enabled') === 'true';
    if (usePersist) {
        try {
            alasql(`CREATE localStorage DATABASE IF NOT EXISTS ${dbName}`);
            alasql(`ATTACH localStorage DATABASE ${dbName}`);
            alasql(`USE ${dbName}`);
            // Vérifier si la base attachée est vide (pas de table setup)
            const tables = alasql('SHOW TABLES');
            if (tables.length === 0 || !tables.find(t => t.tableid === 'setup')) {
                if (typeof INIT_DB_SQL !== 'undefined') {
                    alasql(INIT_DB_SQL);
                }
            }
            return;
        } catch (e) { localStorage.removeItem('alasql_' + dbName); }
    }
    
    if (alasql.databases[dbName]) delete alasql.databases[dbName];
    alasql(`CREATE DATABASE ${dbName}`);
    alasql(`USE ${dbName}`);
    if (typeof INIT_DB_SQL !== 'undefined') {
        alasql(INIT_DB_SQL);
    }
}

function renderSidebar() {
    const aside = document.querySelector('aside');
    if (!aside) return;
    const isPersistent = !!alasql.databases[APP_CONFIG.db_name]?.engineid;

    aside.innerHTML = `
        <nav>
            <ul>
                <li><strong>${APP_CONFIG.title}</strong></li>
                ${APP_CONFIG.menu.map(item => `
                    <li><a href="${item.url}" class="${window.location.pathname.endsWith(item.url) ? 'active' : ''}">${item.label}</a></li>
                `).join('')}
            </ul>
        </nav>
        <div class="sidebar-footer">
            <span>Mode : ${isPersistent ? "🟢 Persistant" : "🟡 Temporaire"}</span>
            <a href="parametres.html" class="settings-link" title="Paramètres Système">⚙️</a>
        </div>
    `;
}

function renderFooterSQL(pageId) {
    const main = document.querySelector('main');
    if (!main) return;
    
    let queries = [];
    
    const config = PAGES_CONFIG[pageId];
    
    if (config) {
        if (config.query) queries.push(config.query);
        if (config.delete_query) queries.push(config.delete_query);
        
        // Pour les formulaires
        if (config.query_get_one) queries.push(config.query_get_one);
        if (config.query_insert) queries.push(config.query_insert);
        if (config.query_update) queries.push(config.query_update);

        // Pour les dashboards
        if (config.charts) config.charts.forEach(c => queries.push(c.query));

    } else {
        // Fallback pour les pages statiques (index, parametres)
        if (pageId === 'index.html') queries.push("-- Guide des Missions SQL --");
        if (pageId === 'parametres.html') queries.push("-- Paramètres techniques de la base --");
    }

    if (queries.length > 0 && !(queries.length===1 && queries[0].trim().startsWith('--'))) {
        const footer = document.createElement('footer');
        footer.style.marginTop = "3rem";
        footer.innerHTML = `<hr><div class="sql-info"><small style="color: #666;">📜 Requêtes SQL de cette page :</small><div class="sql-box">${queries.map(q => highlightSQL(q)).join("<div class='sql-separator'></div>")}</div></div>`;
        main.appendChild(footer);
    }
}

function initPage(pageId) {
    connectDB();
    renderSidebar();
    renderFooterSQL(pageId);
}

/** FONCTIONS DES TEMPLATES EXTERNALISÉES **/

function formatValue(val) {
    if (val !== null && typeof val === 'object') {
        return `<pre class="json-cell object-value">${JSON.stringify(val, null, 2)}</pre>`;
    }else if (val !== null && typeof val === 'string') {
        return `<pre class="json-cell string-value">${val}</pre>`;
    }else if (val !== null && typeof val === 'number') {
        return `<pre class="json-cell number-value">${val}</pre>`;
    }else if (val !== null&&  typeof val === 'boolean') {
        return `<pre class="json-cell boolean-value">${val ? "TRUE":"FALSE"}</pre>`;
    }else if (val !== null&& val) {
        return `<pre class="json-cell">${val}</pre>`;
    }
    return `<pre class="json-cell null-value">NULL</pre>`;
}

function chargerListe(pageId) {
    initPage(pageId);
    const cfg = PAGES_CONFIG[pageId];
    if (!cfg) {
        const pt = document.getElementById('pageTitle');
        if (pt) pt.innerText = "Erreur de configuration";
        return;
    }

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = cfg.title;

    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            if (cfg.form_page_url) {
                window.location.href = cfg.form_page_url;
            } else if (cfg.table_name) {
                const baseUrl = APP_CONFIG.page_details || 'TEMPLATE_form.html';
                window.location.href = `${baseUrl}?table=${cfg.table_name}`;
            }
        };
    }

    const data = alasql(cfg.query);
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if (data.length > 0) {
        const colonnes = Object.keys(data[0]);
        if (tableHead) {
            tableHead.innerHTML = "<tr>" + colonnes.map(col => `<th>${col.replace('_', ' ')}</th>`).join('') + "<th>Actions</th></tr>";
        }

        if (tableBody) {
            tableBody.innerHTML = data.map(item => `
                <tr>
                    ${colonnes.map(col => `<td>${formatValue(item[col])}</td>`).join('')}
                    <td>
                        <div role="group">
                            <button onclick="allerModifier('${pageId}', ${item.id})" class="outline">✏️</button>
                            <button onclick="supprimerEnregistrement('${pageId}', ${item.id})" class="outline secondary">🗑️</button>
                        </div>
                    </td>
                </tr>`).join('');
        }
    } else {
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="100" style="text-align:center">Aucune donnée trouvée.</td></tr>';
        }
    }
}

function allerModifier(pageId, id) {
    const cfg = PAGES_CONFIG[pageId];
    if (cfg.form_page_url) {
        window.location.href = `${cfg.form_page_url}?id=${id}`;
    } else if (cfg.table_name) {
        const baseUrl = APP_CONFIG.page_details || 'TEMPLATE_form.html';
        window.location.href = `${baseUrl}?table=${cfg.table_name}&id=${id}`;
    }
}

function supprimerEnregistrement(pageId, id) {
    if (confirm("Supprimer cet enregistrement ?")) {
        const cfg = PAGES_CONFIG[pageId];
        alasql(cfg.delete_query, [id]);
        chargerListe(pageId);
    }
}

function chargerFormulaire(pageId) {
    initPage(pageId);
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    const cfg = PAGES_CONFIG[pageId];

    if (!cfg) {
        const ft = document.getElementById('formTitle');
        if (ft) ft.innerText = "Erreur : Formulaire non configuré dans config.js";
        return;
    }

    const formTitle = document.getElementById('formTitle');
    if (formTitle) formTitle.innerText = (editId ? "Modifier " : "Ajouter ") + cfg.title;
    
    const container = document.getElementById('fieldsContainer');
    if (container) {
        container.innerHTML = "";
        cfg.fields.forEach(field => {
            const label = document.createElement('label');
            label.innerText = field.label;
            let input;

            if (field.type === 'select') {
                input = document.createElement('select');
                const options = alasql(field.query_options);
                input.innerHTML = '<option value="">-- Choisir --</option>';
                options.forEach(opt => {
                    input.innerHTML += `<option value="${opt.option_value}">${opt.option_text}</option>`;
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }

            input.id = "field_" + field.name;
            input.required = true;
            label.appendChild(input);
            container.appendChild(label);
        });
    }

    if (editId) {
        const data = alasql(cfg.query_get_one, [parseInt(editId)])[0];
        if (data) {
            cfg.fields.forEach(f => {
                const el = document.getElementById("field_" + f.name);
                if (el) el.value = data[f.name];
            });
        }
    }

    const form = document.getElementById('dynamicForm');
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();
            const values = cfg.fields.map(f => document.getElementById("field_" + f.name).value);

            if (editId) {
                alasql(cfg.query_update, [...values, parseInt(editId)]);
            } else {
                alasql(cfg.query_insert, values);
            }
            window.history.back();
        };
    }
}

function chargerStats(pageId) {
    initPage(pageId);
    const cfg = PAGES_CONFIG[pageId];
    if (!cfg) {
        const pt = document.getElementById('pageTitle');
        if (pt) pt.innerText = "Erreur de configuration";
        return;
    }
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = cfg.title;

    const container = document.getElementById('chartsContainer');
    if (container) {
        container.innerHTML = "";
        cfg.charts.forEach(c => {
            if (c.type === 'text') {
                const data = alasql(c.query)[0];
                const article = document.createElement('article');
                article.innerHTML = `<header>${c.title}</header><p style="font-size: 2rem; font-weight: bold; text-align: center; margin: 1rem 0;">${data ? data[c.value_col] : 0}</p>`;
                container.appendChild(article);
            } else {
                const data = alasql(c.query);
                renderChart(c.id, c.type, data, c.label_col, c.value_col, c.title);
            }
        });
    }
}

function chargerIndex() {
    initPage('index.html');
    if (typeof APP_CONFIG !== 'undefined') {
        document.title = APP_CONFIG.title;
        const bannerTitle = document.getElementById('banner-title');
        if (bannerTitle) bannerTitle.innerText = "🚀 " + APP_CONFIG.title;
    }
    setupTabs();
}

function setupTabs() {
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
            tab.setAttribute('aria-selected', 'true');
            panels.forEach(p => p.hidden = true);
            const target = tab.getAttribute('aria-controls');
            const panel = document.getElementById(target);
            if (panel) panel.hidden = false;
        });
    });
}

function renderChart(id, type, data, labelField, valueField, title) {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    const article = document.createElement('article');
    article.innerHTML = `<header>${title}</header>`;
    article.appendChild(canvas);
    const container = document.getElementById('chartsContainer');
    if (container) container.appendChild(article);

    if (typeof Chart !== 'undefined') {
        new Chart(canvas, {
            type: type,
            data: {
                labels: data.map(d => d[labelField]),
                datasets: [{
                    label: title,
                    data: data.map(d => d[valueField]),
                    backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

function chargerVueComplexe(pageId) {
    initPage(pageId);
    const cfg = PAGES_CONFIG[pageId];
    if (!cfg) {
        const pt = document.getElementById('pageTitle');
        if (pt) pt.innerText = "Erreur de configuration";
        return;
    }
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = cfg.title;

    const result = alasql(cfg.query);
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if (result.length > 0) {
        const colonnes = Object.keys(result[0]);
        if (tableHead) {
            tableHead.innerHTML = "<tr>" + colonnes.map(col => `<th>${col}</th>`).join('') + "</tr>";
        }
        if (tableBody) {
            tableBody.innerHTML = result.map(row => "<tr>" + colonnes.map(col => `<td>${formatValue(row[col])}</td>`).join('') + "</tr>").join('');
        }
    }
}

function chargerParametres() {
    initPage('parametres.html');
    if (typeof APP_CONFIG !== 'undefined') {
        document.title = "Paramètres - " + APP_CONFIG.title;
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.innerText = "⚙️ Paramètres - " + APP_CONFIG.title;
    }

    try {
        const tables = alasql('SHOW TABLES');
        const container = document.getElementById('tablesContainer');
        
        if (container) {
            if (tables.length === 0) {
                container.innerHTML = "<p>Aucune table détectée.</p>";
            } else {
                container.innerHTML = tables.filter(t => t.tableid !== 'setup').map(t => {
                    const tableName = t.tableid;
                    let columns = [];
                    try {
                        // Tentative de récupération des colonnes via les métadonnées de AlaSQL
                        const tableObj = alasql.tables[tableName];
                        if (tableObj && tableObj.columns && tableObj.columns.length > 0) {
                            columns = tableObj.columns.map(c => ({
                                columnid: c.columnid,
                                dbtypeid: c.dbtypeid
                            }));
                        } else {
                            // Fallback : interroger une ligne pour deviner les colonnes si elles ne sont pas définies explicitement
                            const sample = alasql(`SELECT * FROM ${tableName} LIMIT 1`);
                            if (sample && sample.length > 0) {
                                columns = Object.keys(sample[0]).map(k => ({
                                    columnid: k,
                                    dbtypeid: typeof sample[0][k]
                                }));
                            }
                        }
                    } catch (err) {
                        console.error("Erreur lors de la récupération des colonnes pour " + tableName, err);
                    }
                    
                    const count = alasql(`SELECT VALUE COUNT(*) FROM ${tableName}`);
                    return `
                        <details>
                            <summary><strong>Table : <code>${tableName}</code></strong> (${count} enregistrements)</summary>
                            <table class="striped">
                                <thead>
                                    <tr>
                                        <th>Colonne</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${columns.map(col => `
                                        <tr>
                                            <td><code>${col.columnid}</code></td>
                                            <td><small>${col.dbtypeid || 'N/A'}</small></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </details>
                    `;
                }).join('');
            }
        }

        if (typeof SQL_QUERIES !== 'undefined' && SQL_QUERIES.setup && SQL_QUERIES.setup.get_status) {
            const statusResult = alasql(SQL_QUERIES.setup.get_status);
            if (statusResult === true) {
                const msgEl = document.getElementById('msg');
                if (msgEl) msgEl.innerHTML = "✅ Système opérationnel et initialisé.";
            }
        }
    } catch (e) {
        console.error(e);
        const msgEl = document.getElementById('msg');
        if (msgEl) msgEl.innerHTML = "⚠️ La base semble vide ou non initialisée.";
    }
}

function reinitialiserBase() {
    if (confirm("Attention : Cela va supprimer TOUTES les données et recharger la page. Continuer ?")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}

/** FONCTIONS DE SAUVEGARDE ET RESTAURATION **/

function sauvegarderBaseDeDonnees() {
    const tables = alasql('SHOW TABLES').map(t => t.tableid).filter(t => t !== 'setup');
    const exportData = {};
    tables.forEach(tableName => {
        exportData[tableName] = alasql(`SELECT * FROM ${tableName}`);
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_db_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function chargerBaseDeDonneesDepuisFichier(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm("Voulez-vous écraser les données actuelles avec cette sauvegarde ?")) {
                Object.keys(data).forEach(tableName => {
                    // On vide la table et on réinsère les données
                    alasql(`DELETE FROM ${tableName}`);
                    if (data[tableName].length > 0) {
                        alasql(`INSERT INTO ${tableName} SELECT * FROM ?`, [data[tableName]]);
                    }
                });
                alert("Base de données restaurée avec succès !");
                location.reload();
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors du chargement du fichier. Vérifiez le format JSON.");
        }
    };
    reader.readAsText(file);
}

function exporterSQLPourInit() {
    const tables = alasql('SHOW TABLES').map(t => t.tableid).filter(t => t !== 'setup');
    let sqlOutput = "-- EXPORT SQL POUR init_db.js\n\n";

    tables.forEach(tableName => {
        // Get table schema
        const tableObj = alasql.tables[tableName];
        if (tableObj && tableObj.columns) {
            const columns = tableObj.columns;
            const columnDefinitions = columns.map(col => {
                let def = `${col.columnid} ${col.dbtypeid || 'STRING'}`; // Default to STRING if type is unknown
                if (col.primarykey) def += ' PRIMARY KEY';
                if (col.autoincrement) def += ' AUTOINCREMENT';
                if (col.notnull) def += ' NOT NULL';
                // Add other constraints as needed
                return def;
            }).join(', ');
            sqlOutput += `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});\n`;
        } else {
            // Fallback if schema is not directly available, try to infer from data
            const sample = alasql(`SELECT * FROM ${tableName} LIMIT 1`);
            if (sample && sample.length > 0) {
                const inferredColumns = Object.keys(sample[0]).map(k => {
                    let type = 'STRING';
                    if (typeof sample[0][k] === 'number') type = 'INT';
                    if (typeof sample[0][k] === 'boolean') type = 'BOOLEAN';
                    return `${k} ${type}`;
                }).join(', ');
                sqlOutput += `CREATE TABLE IF NOT EXISTS ${tableName} (${inferredColumns});\n`;
            } else {
                // If no data and no schema, just create with a dummy column or skip
                sqlOutput += `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY);\n`; // Minimal creation
            }
        }
        sqlOutput += "\n";

        // Export data
        const rows = alasql(`SELECT * FROM ${tableName}`);
        if (rows.length > 0) {
            sqlOutput += `-- Données pour ${tableName}\n`;
            const columns = Object.keys(rows[0]);
            rows.forEach(row => {
                const values = columns.map(col => {
                    const val = row[col];
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                    return val;
                }).join(', ');
                sqlOutput += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
            });
            sqlOutput += "\n";
        }
    });

    // Créer un élément pour afficher ou télécharger le SQL
    const blob = new Blob([sqlOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `init_data_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert("Le fichier SQL a été généré. Vous pouvez copier son contenu dans init_db.js.");
}
