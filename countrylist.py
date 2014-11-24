# -*- coding: utf-8 -*-
from urllib.parse import quote
from urllib.request import urlopen
import json


def getGeocodeInfo(geocode):
  url = 'http://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode=' + quote(geocode)
  content = urlopen(url).read()
  content = json.loads(content.decode('utf-8'))
  geoObject = content['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']
  coords = geoObject['Point']['pos'].replace(' ', ',')
  country = geoObject['metaDataProperty']['GeocoderMetaData']['AddressDetails']['Country']['CountryName']
  return (coords, country)

def getInfo(capital):
  coords, country = getGeocodeInfo(capital)
  content = urlopen('http://ekb.shri14.ru/api/geocode?coords=' + coords).read()
  content = json.loads(content.decode('utf-8'))
  return {'geoid': content['countryId'], 'name': country}


for capital in open('capitallist').read().split('\n'):
  try:
    print(json.dumps(getInfo(capital), ensure_ascii=False))
  except Exception as e:
    print(capital, e)
