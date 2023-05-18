#importamos librerías
from bs4 import BeautifulSoup
import requests
import pandas as pd

#petición get a la página
response = requests.get('https://volvorepuestos.com.pe/repuestos-camiones-volvo/fm-fmx/suspension.html?product_list_limit=30')
#
content = response.text
#parseamos en formato 'lxml'
soup = BeautifulSoup(content,'lxml')
#creamos lista con el tag y clase css
lista = soup.find_all('div',class_='product-item-info type1')

#declaramos variables de tipo array
list_desc = []
list_cod = []
list_img = []

#recorremos la lista para agregar los elementos a cada lista
for item in lista:
    list_desc.append(item.find('strong',class_='product name product-item-name').get_text().strip())
    list_cod.append(item.find('div',class_='marca').get_text().strip())
    list_img.append(item.find('a').img['src'])