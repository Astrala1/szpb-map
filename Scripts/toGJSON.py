import pandas as pd
import geojson
import ast


def data2geojson(df):
    features = []

    def insert_features(X): return features.append(
        geojson.Feature(geometry=geojson.Point((X["longitude"],
                                                X["latitude"],
                                                )),
                        properties=dict(name=X["name"],
                                        type=X["type"],
                                        UID=X["UID"],
                                        description=X["description"],
                                        imgPath=X["imgPath"]
                                        )))
    df.apply(insert_features, axis=1)
    with open('map1_test2.geojson', 'w', encoding='utf16') as fp:
        geojson.dump(geojson.FeatureCollection(features),
                     fp, sort_keys=True, ensure_ascii=False)


df = pd.read_csv('assets/records_worksheet_new.csv')

# reads : longs,lats
#df['long'] = df.apply(lambda x: ast.literal_eval(x['coords'])[0], axis=1)
#df['lat'] = df.apply(lambda x: ast.literal_eval(x['coords'])[1], axis=1)
#print(list(df))
data2geojson(df)