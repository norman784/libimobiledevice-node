import boto3
import hashlib
import zipfile
import os

from shell import uname


class ZipHelper:
    
    def zipdir(path: str, ziph: zipfile.ZipFile):
        # ziph is zipfile handle
        for root, _, files in os.walk(path):
            for file in files:
                ziph.write(os.path.join(root, file), 
                        os.path.relpath(os.path.join(root, file), 
                                        os.path.join(path, '..')))


    def unzip(filename: str, path: str):
        with zipfile.ZipFile(filename, 'r') as zip_ref:
            zip_ref.extractall(path)



class Artifact:

    def __init__(self, bucket_name: str) -> None:
        self.bucket_name = bucket_name
        self.bucket = self._get_bucket()
        

    def get_hash_from(self, file_content: str) -> str:
        hashmap = None
        with open(file_content, 'r') as file:
            hashmap = hashlib.md5(file.read().encode()).hexdigest()
        
        operating_system = uname('-s')
        if operating_system.find('MINGW64') > -1:
            return f'win64-{hashmap}'
        elif operating_system.find('MINGW32') > -1:
            return f'win32-{hashmap}'
        elif operating_system == 'Darwin':
            arch = uname('-m')
            return f'mac-{arch}-{hashmap}'
        
        return ''


    def _zip_artifact(self, sources: str, filename: str):
        print(f'🗜 Zipping {filename}...')
        zipf = zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED)
        ZipHelper.zipdir(sources, zipf)
        zipf.close()
        print(f'🎉 Zipped {filename} successfully')


    def _get_bucket(self):
        s3 = boto3.resource('s3')
        return s3.Bucket(self.bucket_name)


    def try_download_and_unzip_artifact(self, artifact_name: str, remote_path: str, unzip_path: str) -> bool:
        try:
            print(f'📡 Downloading artifact: {artifact_name}...')
            self.bucket.download_file(f'{remote_path}/{artifact_name}', artifact_name)
            print(f'🎉 Downloaded artifact: {artifact_name} successfully')
            
            print(f'Unzipping artifact: {artifact_name}')
            ZipHelper.unzip(artifact_name, unzip_path)
            print(f'🎉 Unzipped successfully')
            
            if os.path.isfile(artifact_name):
                os.remove(artifact_name)
            return True
        except Exception as error:
            print("Error when unziping and downloading artifact: ", error)
            return False

        
    def _is_element_on_s3(self, path: str, element: str) -> bool:
        for object in self.bucket.objects.filter(Prefix=path):
                if object.key.find(element) > -1:
                    return True
        return False


    def try_zip_and_upload_artifact(self, zip_sources_path: str, artifact_name: str, remote_path: str) -> bool:
        try:
            if self._is_element_on_s3(remote_path, artifact_name):
                print(f'🙌 Artifact {artifact_name} is alreadyt on s3')
                return False
            self._zip_artifact(zip_sources_path, artifact_name)
            print(f'💾 Uploading artifact: {artifact_name}...')
            self.bucket.upload_file(artifact_name, f'{remote_path}/{artifact_name}')
            print(f'🎉 Uploaded artifact: {artifact_name} sucessfully')
            if os.path.isfile(artifact_name):
                os.remove(artifact_name)
              
            return True
        except Exception as error:
            print("Error when zipping and uploading artifact: ", error)
            return False