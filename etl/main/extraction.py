#importamos librerías
from bs4 import BeautifulSoup
import requests
import pandas as pd

#petición get a la url
url = 'https://volvorepuestos.com.pe/repuestos-camiones-volvo/fm-fmx/suspension.html?product_list_limit=30'
response = requests.get(url)

#asignamos a content el contenido
content = response.text

#parseamos en formato 'lxml'
soup = BeautifulSoup(content,'lxml')

#creamos lista con el tag y clase css
lista = soup.find_all('div',class_='product-item-info type1')

#declaramos variables de tipo array
list_desc = []
list_cod = []
list_img = []
list_price_base = []
list_price_esti = []

#recorremos la lista para agregar los elementos a cada lista
for item in lista:
    #agregamos elementos a la lista descripcion(list_desc)
    list_desc.append(item.find('strong',class_='product name product-item-name').get_text().strip())
    
    #agregamos elementos a la lista codigo(list_cod)
    list_cod.append(item.find('div',class_='marca').get_text().strip())
    
    #agregamos elementos a la lista imagen(list_img)
    list_img.append(item.find('a').img['src'])

    #agregamos elementos a la lista de precio base(list_price_base)
    list_price_base.append(float(item.find('span',class_='price-container price-final_price tax weee').text.replace('Regular Price\n$','').replace('$','').replace(',','').strip()))
    
    #agregamos elementos a la lista de precio estimado(list_price_esti)
    if item.find('span',class_='special-price'):
        list_price_esti.append(float(item.find('span',class_='special-price').text.replace('Precio especial\n$','').replace('$','').replace(',','').strip()))
    else:
        list_price_esti.append(0.00)