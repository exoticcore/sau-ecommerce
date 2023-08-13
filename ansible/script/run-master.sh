sudo kubeadm config images pull
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

wget https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
sed -i 's/vxlan/host-gw/' kube-flannel.yml
kubectl create -f kube-flannel.yml

