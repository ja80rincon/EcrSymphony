declare -A arr
declare num_comp=9

###

arr[0,0]=graph
arr[0,1]=graph/Dockerfile
arr[0,2]=1.10
arr[0,3]=.
arr[0,4]=graph/

###

arr[1,0]=admin
arr[1,1]=admin/Dockerfile
arr[1,2]=1.2
arr[1,3]=.
arr[1,4]=admin/

###

arr[2,0]=async
arr[2,1]=async/Dockerfile
arr[2,2]=1.3
arr[2,3]=.
arr[2,4]=async/

###

arr[3,0]=store
arr[3,1]=store/Dockerfile
arr[3,2]=1.4
arr[3,3]=.
arr[3,4]=store/

###

arr[4,0]=migrate
arr[4,1]=migrate/Dockerfile
arr[4,2]=1.5
arr[4,3]=.
arr[4,4]=migrate/

###

arr[5,0]=jobrunner
arr[5,1]=jobrunner/Dockerfile
arr[5,2]=1.6
arr[5,3]=.
arr[5,4]=jobrunner/

###

arr[6,0]=front
arr[6,1]=app/fbcnms-projects/platform-server/Dockerfile.prod
arr[6,2]=1.7
arr[6,3]=app
arr[6,4]=app/fbcnms-projects/platform-server/

###

arr[7,0]=docs
arr[7,1]=docs/Dockerfile
arr[7,2]=1.8
arr[7,3]=docs
arr[7,4]=docs/

###

arr[8,0]=storybook
arr[8,1]=app/fbcnms-projects/storybook/Dockerfile
arr[8,2]=1.9
arr[8,3]=app
arr[8,4]=app/fbcnms-projects/storybook/

####################

for ((n=0;n<num_comp;n++)); do
  arr[$n,2]="$(yq eval '.version' $PWD/${arr[$n,4]}version.yml)"
done

####################

for ((n=0;n<num_comp;n++)); do
  pathEnv=".${arr[$n,0]}.image.tag"  valueEnv="${arr[$n,0]}-v${arr[$n,2]}" yq -i 'eval(strenv(pathEnv)) = strenv(valueEnv)' ./repoTest/values.yaml
  pathEnv=".${arr[$n,0]}.image.registry"  valueEnv="$ECR_REGISTRY" yq -i 'eval(strenv(pathEnv)) = strenv(valueEnv)' ./repoTest/values.yaml
  pathEnv=".${arr[$n,0]}.image.repository"  valueEnv="$ECR_REPOSITORY_PROD" yq -i 'eval(strenv(pathEnv)) = strenv(valueEnv)' ./repoTest/values.yaml
done

cat ./repoTest/values.yaml