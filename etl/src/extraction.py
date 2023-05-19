#importamos librerías y módulos
import src.db_connection as conexion
from bs4 import BeautifulSoup
import requests
import pandas as pd
import psycopg2



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
    list_cod.append(item.find('div',class_='marca').get_text().replace('Para: Camiones Volvo  ','').replace('Para: Buses Volvo, Camiones Volvo  ','').replace(' ','').strip())
    
    #agregamos elementos a la lista imagen(list_img)
    list_img.append(item.find('a').img['src'])

    #agregamos elementos a la lista de precio base(list_price_base)
    list_price_base.append(float(item.find('span',class_='price-container price-final_price tax weee').text.replace('Regular Price\n$','').replace('$','').replace(',','').strip()))
    
    #agregamos elementos a la lista de precio estimado(list_price_esti)
    if item.find('span',class_='special-price'):
        list_price_esti.append(float(item.find('span',class_='special-price').text.replace('Precio especial\n$','').replace('$','').replace(',','').strip()))
    else:
        list_price_esti.append(0.00)

#creamos el diccionario
dict_resp = {'ID':1,'DESCRIPCION':list_desc,'CODIGO_REPUESTO':list_cod,'PRECIO_ESTIMADO':list_price_esti,'PRECIO_BASE':list_price_base}

#creamos un dataframe a partir de dict_resp(diccionario)
df_resp = pd.DataFrame(dict_resp)
df_resp['ID'] = df_resp.index + 1

#grabar archivo con extención .csv
df_resp.to_csv('repuesto.csv',index=False,header=True)

#grabar archivo en formato json
df_resp.to_json("REPUESTOS.json",orient='records')

#conexion con la base de datos
conex = conexion.get_conn()
conn,server = conex
cur = conn.cursor()

#funcion para insertar el dataframe a una tabla de la bd
def insertIntoTable(df, table):
        # Crear una lista de tuplas con valores de columnas
        tuples = list(set([tuple(x) for x in df.to_numpy()]))
    
        # separa las columnas del dataframe que está por comas(,)
        cols = ','.join(list(df.columns))
        # ejecutamos la consulta query
        query = "INSERT INTO %s(%s) VALUES(%%s,%%s,%%s,%%s,%%s)" % (
            table, cols)
    
        try:
            cur.executemany(query, tuples)
            conn.commit()

        except (Exception, psycopg2.DatabaseError) as error:
            print("Error: %s" % error)
            conn.rollback()
            return 1

#invocamos a la funcion pasando los parámetros(dataframe,nombre de tabla)
insertIntoTable(df_resp,'repuesto')


