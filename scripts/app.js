/**
 * InventoryPro - Enterprise Inventory Management System
 * Main Application JavaScript
 * Version: 1.0.0
 */

class InventoryPro {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.data = {
            products: [],
            customers: [],
            sales: [],
            stockMovements: [],
            users: []
        };
        this.filters = {
            productSearch: '',
            productCategory: '',
            productSupplier: ''
        };
        this.charts = {};
        this.init();
    }

    init() {
        this.showLoadingScreen();
        setTimeout(() => {
            this.initializeData();
            this.bindEvents();
            this.showLoginModal();
            this.hideLoadingScreen();
        }, 2000);
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('app').classList.add('hidden');
        document.getElementById('login-modal').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }

    showApp() {
        this.hideLoginModal();
        this.updateDashboard();
        this.loadPage('dashboard');
    }

    // Data Management
    initializeData() {
        // Initialize with sample data
        this.data.products = [
            {
                id: 1,
                sku: 'SKU-001',
                name: 'Wireless Headphones Pro',
                category: 'Electronics',
                supplier: 'Tech Solutions Inc.',
                cost: 59.99,
                price: 99.99,
                stock: 45,
                minStock: 10,
                description: 'High-quality wireless headphones with noise cancellation',
                barcode: '1234567890123',
                status: 'active',
                created: '2024-11-01'
            },
            {
                id: 2,
                sku: 'SKU-002',
                name: 'USB-C Cable 3m',
                category: 'Accessories',
                supplier: 'Global Components Ltd.',
                cost: 8.99,
                price: 12.99,
                stock: 230,
                minStock: 20,
                description: '3-meter USB-C charging and data cable',
                barcode: '9876543210987',
                status: 'active',
                created: '2024-11-02'
            },
            {
                id: 3,
                sku: 'SKU-003',
                name: 'Wireless Gaming Mouse',
                category: 'Electronics',
                supplier: 'Tech Solutions Inc.',
                cost: 45.99,
                price: 79.99,
                stock: 8,
                minStock: 15,
                description: 'Professional wireless gaming mouse with RGB lighting',
                barcode: '5555666677778',
                status: 'active',
                created: '2024-11-03'
            }
        ];

        this.data.customers = [
            {
                id: 1,
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '+1 (555) 123-4567',
                address: '123 Main St, New York, NY 10001',
                totalOrders: 12,
                totalSpent: 2340.00,
                created: '2024-10-15'
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '+1 (555) 987-6543',
                address: '456 Oak Ave, Los Angeles, CA 90210',
                totalOrders: 8,
                totalSpent: 1650.00,
                created: '2024-10-20'
            }
        ];

        this.data.sales = [
            {
                id: 1,
                invoiceNumber: 'INV-2024-001',
                date: '2024-11-07',
                customerId: 1,
                customerName: 'John Smith',
                items: [
                    { productId: 1, name: 'Wireless Headphones Pro', quantity: 2, price: 99.99 },
                    { productId: 2, name: 'USB-C Cable 3m', quantity: 1, price: 12.99 }
                ],
                total: 212.97,
                status: 'paid',
                created: '2024-11-07 14:30'
            }
        ];

        this.data.stockMovements = [
            {
                id: 1,
                date: '2024-11-07 14:30',
                productId: 1,
                productName: 'Wireless Headphones Pro',
                type: 'in',
                quantity: 50,
                reference: 'PO-2024-001',
                user: 'Admin User',
                reason: 'Purchase Order'
            },
            {
                id: 2,
                date: '2024-11-07 12:15',
                productId: 2,
                productName: 'USB-C Cable 3m',
                type: 'out',
                quantity: 5,
                reference: 'SO-2024-003',
                user: 'Sales User',
                reason: 'Sale'
            },
            {
                id: 3,
                date: '2024-11-07 10:45',
                productId: 3,
                productName: 'Wireless Gaming Mouse',
                type: 'adjustment',
                quantity: 2,
                reference: 'ADJ-2024-001',
                user: 'Manager',
                reason: 'Stock correction'
            }
        ];

        this.data.users = [
            {
                id: 'admin',
                username: 'admin',
                fullName: 'Admin User',
                email: 'admin@company.com',
                role: 'admin',
                status: 'active',
                created: '2024-01-01'
            },
            {
                id: 'manager',
                username: 'manager',
                fullName: 'Manager User',
                email: 'manager@company.com',
                role: 'manager',
                status: 'active',
                created: '2024-01-01'
            },
            {
                id: 'user',
                username: 'user',
                fullName: 'Sales User',
                email: 'user@company.com',
                role: 'user',
                status: 'active',
                created: '2024-01-01'
            }
        ];

        this.loadDataFromStorage();
    }

    saveDataToStorage() {
        localStorage.setItem('inventoryPro_data', JSON.stringify(this.data));
        localStorage.setItem('inventoryPro_user', JSON.stringify(this.currentUser));
    }

    loadDataFromStorage() {
        const savedData = localStorage.getItem('inventoryPro_data');
        const savedUser = localStorage.getItem('inventoryPro_user');
        
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        }
        
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Event Binding
    bindEvents() {
        // Login
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
            });
        });

        // Sidebar toggle (mobile)
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Global search
        document.getElementById('global-search').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Product management
        document.getElementById('add-product').addEventListener('click', () => {
            this.openProductModal();
        });

        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // Stock management
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        document.getElementById('stock-adjustment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStockAdjustment();
        });

        // Filters
        document.getElementById('product-search').addEventListener('input', (e) => {
            this.filters.productSearch = e.target.value.toLowerCase();
            this.filterProducts();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filters.productCategory = e.target.value;
            this.filterProducts();
        });

        document.getElementById('supplier-filter').addEventListener('change', (e) => {
            this.filters.productSupplier = e.target.value;
            this.filterProducts();
        });

        // Barcode scanner
        document.getElementById('start-camera').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('stop-camera').addEventListener('click', () => {
            this.stopCamera();
        });

        document.getElementById('barcode-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBarcodeInput();
        });

        // Settings
        document.getElementById('company-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCompanySettings();
        });

        // Modal close
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
    }

    // Authentication
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple demo authentication
        if (username === 'admin' && password === 'admin') {
            this.currentUser = {
                id: 'admin',
                username: 'admin',
                fullName: 'Admin User',
                role: 'admin',
                email: 'admin@company.com'
            };
            
            this.showApp();
            this.showNotification('Login successful!', 'success');
        } else if (username === 'manager' && password === 'manager') {
            this.currentUser = {
                id: 'manager',
                username: 'manager',
                fullName: 'Manager User',
                role: 'manager',
                email: 'manager@company.com'
            };
            
            this.showApp();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials. Try admin/admin or manager/manager', 'error');
        }
    }

    // Navigation
    loadPage(page) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update active page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;

        // Load page-specific content
        switch (page) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'products':
                this.renderProductsTable();
                break;
            case 'stock':
                this.renderStockMovements();
                break;
            case 'customers':
                this.renderCustomersTable();
                break;
            case 'sales':
                this.renderSalesTable();
                break;
            case 'reports':
                this.setupReports();
                break;
            case 'barcode':
                this.setupBarcodeScanner();
                break;
            case 'users':
                this.renderUsersTable();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    updateDashboard() {
        // Update KPIs
        const totalProducts = this.data.products.length;
        const totalStockValue = this.data.products.reduce((sum, product) => {
            return sum + (product.stock * product.cost);
        }, 0);
        const lowStockAlerts = this.data.products.filter(p => p.stock <= p.minStock).length;
        const monthlyRevenue = this.data.sales.reduce((sum, sale) => sum + sale.total, 0);

        document.getElementById('total-products').textContent = totalProducts.toLocaleString();
        document.getElementById('total-stock-value').textContent = `$${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('low-stock-alerts').textContent = lowStockAlerts;
        document.getElementById('monthly-revenue').textContent = `$${monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

        // Update top products
        this.renderTopProducts();

        // Update recent activities
        this.renderRecentActivities();

        // Update sales chart
        this.updateSalesChart();
    }

    renderTopProducts() {
        const topProducts = this.data.products
            .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
            .slice(0, 5);

        const tbody = document.getElementById('top-products');
        tbody.innerHTML = topProducts.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.stock}</td>
                <td>$${(product.stock * product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
        `).join('');
    }

    renderRecentActivities() {
        const activities = [
            { icon: 'fas fa-plus-circle', text: `New product added: ${this.data.products[this.data.products.length - 1]?.name || 'Product'}`, time: '2 hours ago', class: 'text-success' },
            { icon: 'fas fa-shopping-cart', text: `Sale completed: ${this.data.sales[this.data.sales.length - 1]?.invoiceNumber || 'Order'}`, time: '4 hours ago', class: 'text-primary' },
            { icon: 'fas fa-exclamation-triangle', text: `Low stock alert: ${this.data.products.find(p => p.stock <= p.minStock)?.name || 'Product'} (${this.data.products.find(p => p.stock <= p.minStock)?.stock || 0} units left)`, time: '6 hours ago', class: 'text-warning' }
        ];

        const container = document.getElementById('recent-activities');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="${activity.icon} ${activity.class}"></i>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    updateSalesChart() {
        const ctx = document.getElementById('sales-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.sales) {
            this.charts.sales.destroy();
        }

        // Sample data for the chart
        const salesData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales ($)',
                data: [1200, 1900, 3000, 5000, 2300, 3200, 4100],
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Product Management
    renderProductsTable() {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        const filteredProducts = this.filterProducts();
        
        tbody.innerHTML = filteredProducts.map(product => `
            <tr>
                <td><input type="checkbox" class="product-checkbox" value="${product.id}"></td>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.supplier}</td>
                <td>${product.stock}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${product.stock <= product.minStock ? 'low' : 'active'}">
                        ${product.stock <= product.minStock ? 'Low Stock' : 'Active'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="inventoryApp.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="inventoryApp.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterProducts() {
        let filtered = this.data.products;

        if (this.filters.productSearch) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.filters.productSearch) ||
                product.sku.toLowerCase().includes(this.filters.productSearch) ||
                product.category.toLowerCase().includes(this.filters.productSearch)
            );
        }

        if (this.filters.productCategory) {
            filtered = filtered.filter(product => product.category === this.filters.productCategory);
        }

        if (this.filters.productSupplier) {
            filtered = filtered.filter(product => product.supplier === this.filters.productSupplier);
        }

        return filtered;
    }

    openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        if (productId) {
            // Edit mode
            const product = this.data.products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Edit Product';
                document.getElementById('product-sku').value = product.sku;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-supplier').value = product.supplier;
                document.getElementById('product-cost').value = product.cost;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-stock').value = product.stock;
                document.getElementById('product-min-stock').value = product.minStock;
                document.getElementById('product-description').value = product.description || '';
                document.getElementById('product-barcode').value = product.barcode || '';
                form.dataset.editId = productId;
            }
        } else {
            // Add mode
            title.textContent = 'Add Product';
            form.reset();
            delete form.dataset.editId;
            document.getElementById('product-sku').value = `SKU-${String(this.data.products.length + 1).padStart(3, '0')}`;
        }

        modal.classList.remove('hidden');
    }

    handleProductSubmit() {
        const form = document.getElementById('product-form');
        const productData = {
            sku: document.getElementById('product-sku').value,
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            supplier: document.getElementById('product-supplier').value,
            cost: parseFloat(document.getElementById('product-cost').value) || 0,
            price: parseFloat(document.getElementById('product-price').value) || 0,
            stock: parseInt(document.getElementById('product-stock').value) || 0,
            minStock: parseInt(document.getElementById('product-min-stock').value) || 5,
            description: document.getElementById('product-description').value,
            barcode: document.getElementById('product-barcode').value,
            status: 'active',
            created: new Date().toISOString().split('T')[0]
        };

        const editId = form.dataset.editId;
        
        if (editId) {
            // Update existing product
            const productIndex = this.data.products.findIndex(p => p.id == editId);
            if (productIndex !== -1) {
                this.data.products[productIndex] = { ...this.data.products[productIndex], ...productData };
                this.showNotification('Product updated successfully!', 'success');
            }
        } else {
            // Add new product
            productData.id = this.data.products.length + 1;
            this.data.products.push(productData);
            this.showNotification('Product added successfully!', 'success');
        }

        this.saveDataToStorage();
        this.closeModal();
        this.renderProductsTable();
        this.updateDashboard();
    }

    editProduct(productId) {
        this.openProductModal(productId);
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.data.products = this.data.products.filter(p => p.id !== productId);
            this.saveDataToStorage();
            this.renderProductsTable();
            this.updateDashboard();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    // Stock Management
    renderStockMovements() {
        const tbody = document.getElementById('stock-movements-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.data.stockMovements.map(movement => `
            <tr>
                <td>${movement.date}</td>
                <td>${movement.productName}</td>
                <td>
                    <span class="movement-badge movement-${movement.type}">
                        ${movement.type.toUpperCase()}
                    </span>
                </td>
                <td>${movement.type === 'in' ? '+' : '-'}${movement.quantity}</td>
                <td>${movement.reference}</td>
                <td>${movement.user}</td>
            </tr>
        `).join('');
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    handleStockAdjustment() {
        const productId = parseInt(document.getElementById('adj-product').value);
        const type = document.getElementById('adj-type').value;
        const quantity = parseInt(document.getElementById('adj-quantity').value);
        const reason = document.getElementById('adj-reason').value;
        const notes = document.getElementById('adj-notes').value;

        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Product not found!', 'error');
            return;
        }

        // Update product stock
        if (type === 'increase') {
            product.stock += quantity;
        } else if (type === 'decrease') {
            product.stock = Math.max(0, product.stock - quantity);
        }

        // Add stock movement record
        this.data.stockMovements.unshift({
            id: this.data.stockMovements.length + 1,
            date: new Date().toLocaleString(),
            productId: productId,
            productName: product.name,
            type: type === 'increase' ? 'in' : 'out',
            quantity: quantity,
            reference: `ADJ-${Date.now()}`,
            user: this.currentUser.fullName,
            reason: reason
        });

        this.saveDataToStorage();
        this.showNotification('Stock adjustment applied successfully!', 'success');
        
        // Reset form
        document.getElementById('stock-adjustment-form').reset();
        this.renderStockMovements();
        this.updateDashboard();
    }

    // Customer Management
    renderCustomersTable() {
        const tbody = document.getElementById('customers-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.data.customers.map(customer => `
            <tr>
                <td>CUST-${String(customer.id).padStart(3, '0')}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalOrders}</td>
                <td>$${customer.totalSpent.toFixed(2)}</td>
                <td>
                    <button class="btn-icon" onclick="inventoryApp.viewCustomer(${customer.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="inventoryApp.editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Sales Management
    renderSalesTable() {
        const tbody = document.getElementById('sales-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.data.sales.map(sale => `
            <tr>
                <td>${sale.invoiceNumber}</td>
                <td>${sale.date}</td>
                <td>${sale.customerName}</td>
                <td>${sale.items.length}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${sale.status}">
                        ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="inventoryApp.viewInvoice(${sale.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="inventoryApp.printInvoice(${sale.id})">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Reports
    setupReports() {
        // Initialize reports functionality
        this.showNotification('Reports module ready!', 'success');
    }

    generateReport(type) {
        this.showNotification(`Generating ${type} report...`, 'success');
        
        setTimeout(() => {
            const reportData = this.generateReportData(type);
            this.downloadReport(reportData, `${type}-report.csv`);
        }, 1000);
    }

    generateReportData(type) {
        switch (type) {
            case 'inventory':
                return this.data.products.map(p => ({
                    SKU: p.sku,
                    Name: p.name,
                    Category: p.category,
                    Stock: p.stock,
                    'Min Stock': p.minStock,
                    'Cost Price': p.cost,
                    'Selling Price': p.price,
                    'Stock Value': p.stock * p.cost
                }));
            case 'sales':
                return this.data.sales.map(s => ({
                    'Invoice Number': s.invoiceNumber,
                    Date: s.date,
                    Customer: s.customerName,
                    'Total Items': s.items.length,
                    'Total Amount': s.total,
                    Status: s.status
                }));
            default:
                return [];
        }
    }

    downloadReport(data, filename) {
        if (data.length === 0) {
            this.showNotification('No data to export!', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Report downloaded successfully!', 'success');
    }

    // Barcode Scanner
    setupBarcodeScanner() {
        // Initialize barcode scanner interface
        this.showNotification('Barcode scanner ready!', 'success');
    }

    async startCamera() {
        try {
            const video = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            video.srcObject = stream;
            document.getElementById('start-camera').style.display = 'none';
            document.getElementById('stop-camera').style.display = 'inline-flex';
            
            this.showNotification('Camera started!', 'success');
        } catch (error) {
            this.showNotification('Camera access denied or not available!', 'error');
        }
    }

    stopCamera() {
        const video = document.getElementById('video');
        const stream = video.srcObject;
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        document.getElementById('start-camera').style.display = 'inline-flex';
        document.getElementById('stop-camera').style.display = 'none';
        
        this.showNotification('Camera stopped!', 'success');
    }

    handleBarcodeInput() {
        const barcode = document.getElementById('barcode-input').value.trim();
        if (barcode) {
            this.searchByBarcode(barcode);
        }
    }

    searchByBarcode(barcode) {
        const product = this.data.products.find(p => p.barcode === barcode);
        if (product) {
            this.showNotification(`Product found: ${product.name}`, 'success');
            // Add to recent scans
            this.addRecentScan(barcode, product.name);
        } else {
            this.showNotification('Product not found!', 'warning');
        }
    }

    addRecentScan(barcode, productName) {
        const recentScans = document.getElementById('recent-scans');
        const scanElement = document.createElement('div');
        scanElement.className = 'scan-item';
        scanElement.innerHTML = `
            <span class="barcode">${barcode}</span>
            <span class="product">${productName}</span>
            <span class="timestamp">Just now</span>
        `;
        
        recentScans.insertBefore(scanElement, recentScans.firstChild);
        
        // Keep only last 10 scans
        while (recentScans.children.length > 10) {
            recentScans.removeChild(recentScans.lastChild);
        }
    }

    // User Management
    renderUsersTable() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.data.users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge role-${user.role}">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="inventoryApp.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Settings
    loadSettings() {
        // Load company settings from localStorage or use defaults
        const settings = JSON.parse(localStorage.getItem('inventoryPro_settings') || '{}');
        
        document.getElementById('company-name').value = settings.companyName || 'Your Company Name';
        document.getElementById('company-address').value = settings.companyAddress || '';
        document.getElementById('company-phone').value = settings.companyPhone || '';
        document.getElementById('company-email').value = settings.companyEmail || '';
        document.getElementById('low-stock-threshold').value = settings.lowStockThreshold || 10;
        document.getElementById('auto-reorder').value = settings.autoReorder || 'false';
        document.getElementById('currency').value = settings.currency || 'USD';
    }

    saveCompanySettings() {
        const settings = {
            companyName: document.getElementById('company-name').value,
            companyAddress: document.getElementById('company-address').value,
            companyPhone: document.getElementById('company-phone').value,
            companyEmail: document.getElementById('company-email').value,
            lowStockThreshold: parseInt(document.getElementById('low-stock-threshold').value),
            autoReorder: document.getElementById('auto-reorder').value,
            currency: document.getElementById('currency').value
        };

        localStorage.setItem('inventoryPro_settings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Utility Functions
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // Search across products, customers, and orders
        const results = {
            products: this.data.products.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.sku.toLowerCase().includes(query.toLowerCase())
            ),
            customers: this.data.customers.filter(c => 
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.email.toLowerCase().includes(query.toLowerCase())
            )
        };

        if (results.products.length > 0) {
            this.loadPage('products');
        } else if (results.customers.length > 0) {
            this.loadPage('customers');
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type]} notification-icon"></i>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Action functions for global access
    viewCustomer(customerId) {
        const customer = this.data.customers.find(c => c.id === customerId);
        if (customer) {
            this.showNotification(`Viewing customer: ${customer.name}`, 'info');
        }
    }

    editCustomer(customerId) {
        this.showNotification('Customer editing not implemented in demo', 'info');
    }

    viewInvoice(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (sale) {
            this.showNotification(`Viewing invoice: ${sale.invoiceNumber}`, 'info');
        }
    }

    printInvoice(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (sale) {
            this.showNotification(`Printing invoice: ${sale.invoiceNumber}`, 'info');
        }
    }

    editUser(userId) {
        this.showNotification('User editing not implemented in demo', 'info');
    }
}

// Global functions for onclick handlers
function editProduct(id) {
    if (window.inventoryApp) {
        window.inventoryApp.editProduct(id);
    }
}

function deleteProduct(id) {
    if (window.inventoryApp) {
        window.inventoryApp.deleteProduct(id);
    }
}

function viewCustomer(id) {
    if (window.inventoryApp) {
        window.inventoryApp.viewCustomer(id);
    }
}

function editCustomer(id) {
    if (window.inventoryApp) {
        window.inventoryApp.editCustomer(id);
    }
}

function viewInvoice(id) {
    if (window.inventoryApp) {
        window.inventoryApp.viewInvoice(id);
    }
}

function printInvoice(id) {
    if (window.inventoryApp) {
        window.inventoryApp.printInvoice(id);
    }
}

function editUser(id) {
    if (window.inventoryApp) {
        window.inventoryApp.editUser(id);
    }
}

function generateReport(type) {
    if (window.inventoryApp) {
        window.inventoryApp.generateReport(type);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryApp = new InventoryPro();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    if (window.inventoryApp) {
        // Close sidebar on desktop
        if (window.innerWidth > 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }
});
