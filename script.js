document.addEventListener('DOMContentLoaded', function() {
    // Adicionar funcionalidade de pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const tables = document.querySelectorAll('.table');
            
            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Adicionar funcionalidade de progresso
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        // Carregar estado salvo
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
            checkbox.closest('tr').classList.add('completed-task');
        }
        
        checkbox.addEventListener('change', function() {
            // Salvar estado
            localStorage.setItem(this.id, this.checked);
            
            // Atualizar visual
            if (this.checked) {
                this.closest('tr').classList.add('completed-task');
            } else {
                this.closest('tr').classList.remove('completed-task');
            }
            
            // Atualizar progresso
            updateProgress();
        });
    });
    
    // Função para atualizar o progresso
    function updateProgress() {
        const semanas = ['semana1', 'semana2', 'semana3', 'semana4'];
        
        semanas.forEach(semana => {
            const total = document.querySelectorAll(`#pills-${semana} .task-checkbox`).length;
            const completed = document.querySelectorAll(`#pills-${semana} .task-checkbox:checked`).length;
            
            if (total > 0) {
                const percentage = Math.round((completed / total) * 100);
                const progressBar = document.querySelector(`#progress-${semana} .progress-bar`);
                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                    progressBar.setAttribute('aria-valuenow', percentage);
                    progressBar.textContent = `${percentage}%`;
                }
            }
        });
    }
    
    // Inicializar progresso
    updateProgress();
    
    // Adicionar funcionalidade de impressão
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Adicionar funcionalidade de exportar para PDF
    const exportPdfButton = document.getElementById('exportPdfButton');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', function() {
            alert('Para salvar como PDF, use a função de impressão do navegador e selecione "Salvar como PDF".');
            window.print();
        });
    }
    
    // Adicionar funcionalidade de tema claro/escuro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Verificar tema salvo
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Adicionar funcionalidade de contador regressivo
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // Verificar data salva
        let targetDate = localStorage.getItem('examDate');
        if (!targetDate) {
            // Se não houver data salva, usar data padrão (3 meses a partir de hoje)
            const defaultDate = new Date();
            defaultDate.setMonth(defaultDate.getMonth() + 3);
            targetDate = defaultDate.toISOString().split('T')[0];
            localStorage.setItem('examDate', targetDate);
        }
        
        // Atualizar campo de data
        const dateInput = document.getElementById('examDateInput');
        if (dateInput) {
            dateInput.value = targetDate;
            
            dateInput.addEventListener('change', function() {
                localStorage.setItem('examDate', this.value);
                updateCountdown();
            });
        }
        
        function updateCountdown() {
            const examDate = new Date(localStorage.getItem('examDate'));
            const today = new Date();
            
            // Calcular diferença em dias
            const diffTime = examDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                countdownElement.textContent = `${diffDays} dias para a prova`;
                countdownElement.classList.remove('text-danger');
                countdownElement.classList.add('text-primary');
            } else if (diffDays === 0) {
                countdownElement.textContent = 'A prova é hoje!';
                countdownElement.classList.remove('text-primary');
                countdownElement.classList.add('text-danger');
            } else {
                countdownElement.textContent = 'A data da prova já passou';
                countdownElement.classList.remove('text-primary');
                countdownElement.classList.add('text-danger');
            }
        }
        
        // Inicializar contador
        updateCountdown();
        
        // Atualizar contador diariamente
        setInterval(updateCountdown, 86400000); // 24 horas
    }
});
