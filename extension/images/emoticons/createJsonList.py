import os,json,io

dirList = os.listdir(os.getcwd())
images = []
for filename in dirList:
    if '@2x' in filename:
        images.append(filename)
    
with open('emoticons.json', 'w') as outfile:
  json.dump(images, outfile, indent=4)