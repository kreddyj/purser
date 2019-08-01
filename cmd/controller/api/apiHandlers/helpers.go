/*
 * Copyright (c) 2018 VMware Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package apiHandlers

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/Sirupsen/logrus"
	v1 "github.com/vmware/purser/pkg/client/clientset/typed/groups/v1"
	"github.com/vmware/purser/pkg/controller"
	"k8s.io/apimachinery/pkg/util/yaml"
	"k8s.io/client-go/kubernetes"
)

var groupClient *v1.GroupClient
var kubeClient *kubernetes.Clientset

func addHeaders(w *http.ResponseWriter, r *http.Request) {
	addAccessControlHeaders(w, r)
	(*w).Header().Set("Content-Type", "application/json; charset=UTF-8")
	(*w).WriteHeader(http.StatusOK)
}

func addAccessControlHeaders(w *http.ResponseWriter, r *http.Request) {
	// (*w).Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func writeBytes(w io.Writer, data []byte) {
	_, err := w.Write(data)
	if err != nil {
		logrus.Errorf("Unable to encode to json: (%v)", err)
	}
}

func encodeAndWrite(w io.Writer, obj interface{}) {
	err := json.NewEncoder(w).Encode(obj)
	if err != nil {
		logrus.Errorf("Unable to encode to json: (%v)", err)
	}
}

func convertRequestBodyToJSON(r *http.Request) ([]byte, error) {
	requestData, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	groupData, err := yaml.ToJSON(requestData)
	return groupData, err
}

// SetKubeClientAndGroupClient sets groupcrd client
func SetKubeClientAndGroupClient(conf controller.Config) {
	groupClient = conf.Groupcrdclient
	kubeClient = conf.Kubeclient
}

func getGroupClient() *v1.GroupClient {
	return groupClient
}

func getKubeClient() *kubernetes.Clientset {
	return kubeClient
}
