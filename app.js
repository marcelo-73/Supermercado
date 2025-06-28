let productos = [];
let lista = [];

// Cargar datos desde Firestore
async function cargarDatos() {
  const prodSnapshot = await db.collection('productos').get();
  productos = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const listaSnapshot = await db.collection('listaCompras').orderBy('createdAt').get();
  lista = listaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  renderCatalogo();
  renderLista();
}

// Render catálogo
function renderCatalogo() {
  const catalogo = document.getElementById('catalogo');
  const selector = document.getElementById('selectorProducto');
  catalogo.innerHTML = '';
  selector.innerHTML = '<option value="">-- Seleccioná un producto --</option>';

  productos.forEach((p) => {
    catalogo.innerHTML += `
      <div class="producto">
        <img src="${p.img}" />
        <span>${p.nombre}</span>
        <button onclick="borrarProducto('${p.id}')">❌</button>
      </div>`;
    selector.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
  });
}

// Render lista de compras
function renderLista() {
  const ulPendientes = document.getElementById('listaPendiente');
  const ulComprados = document.getElementById('listaComprados');
  ulPendientes.innerHTML = '';
  ulComprados.innerHTML = '';

  lista.forEach(item => {
    const itemHTML = `
      <li class="item-lista">
        <img src="${item.img}" />
        <span style="text-decoration:${item.checked ? 'line-through' : 'none'}">${item.nombre}</span>
        <input type="checkbox" onchange="toggle('${item.id}')" ${item.checked ? 'checked' : ''}>
        <button onclick="borrarDeLista('${item.id}')">🗑</button>
      </li>`;

    if (item.checked) {
      ulComprados.innerHTML += itemHTML;
    } else {
      ulPendientes.innerHTML += itemHTML;
    }
  });
}

// Agregar producto nuevo
async function agregarProducto() {
  const nombre = document.getElementById('nombreProducto').value.trim();
  const imagenInput = document.getElementById('imagenProducto');

  if (!nombre || !imagenInput.files[0]) return alert('Completá nombre e imagen');

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      await db.collection('productos').add({
        nombre,
        img: e.target.result
      });
      document.getElementById('nombreProducto').value = '';
      imagenInput.value = '';
      await cargarDatos();
    } catch (error) {
      alert('Error guardando producto: ' + error.message);
    }
  };
  reader.readAsDataURL(imagenInput.files[0]);
}

// Agregar producto a la lista de compras
async function agregarALista() {
  const productoId = document.getElementById('selectorProducto').value;
  if (!productoId) return;
  const prod = productos.find(p => p.id === productoId);
  if (!prod) return;

  await db.collection('listaCompras').add({
    nombre: prod.nombre,
    img: prod.img,
    checked: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  await cargarDatos();
}

// Marcar como comprado/no comprado
async function toggle(id) {
  const item = lista.find(i => i.id === id);
  if (!item) return;

  await db.collection('listaCompras').doc(id).update({
    checked: !item.checked
  });

  await cargarDatos();
}

// Borrar producto del catálogo
async function borrarProducto(id) {
  await db.collection('productos').doc(id).delete();
  await cargarDatos();
}

// Borrar producto de la lista
async function borrarDeLista(id) {
  await db.collection('listaCompras').doc(id).delete();
  await cargarDatos();
}

// Cambiar de vista (productos o lista)
function mostrarSeccion(seccionId) {
  document.getElementById('productos').classList.add('oculto');
  document.getElementById('lista').classList.add('oculto');
  document.getElementById(seccionId).classList.remove('oculto');
}

// Inicializar al cargar
cargarDatos().then(() => mostrarSeccion('productos'));
