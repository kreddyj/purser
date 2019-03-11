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

package query

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func mockDgraphForClusterQueries() {
	executeQuery = func(query string, root interface{}) error {
		if query == "" {
			return fmt.Errorf("unable to connect/retrieve data from dgraph")
		}

		dummyParentWrapper, ok := root.(*ParentWrapper)
		if !ok {
			return fmt.Errorf("wrong root received")
		}

		if query == physicalResourceHierarchyTestQuery || query == logicalResourceHierarchyTestQuery {
			firstNamespace := Children{
				Name: "namespace-first",
				Type: NamespaceType,
			}
			secondNamespace := Children{
				Name: "namespace-second",
				Type: NamespaceType,
			}
			hierarchyChildren := []Children{firstNamespace, secondNamespace}
			dummyParentWrapper.Children = hierarchyChildren
			return nil
		} else if query == phycialResourcesMetricTestQuery || query == logicalResourcesMetricTestQuery {
			firstNamespaceWithMetrics := Children{
				Name:        "namespace-first",
				Type:        NamespaceType,
				CPU:         0.90,
				Memory:      3,
				Storage:     1,
				CPUCost:     0.09,
				MemoryCost:  0.31,
				StorageCost: 0.11,
			}
			secondNamespaceWithMetrics := Children{
				Name:        "namespace-second",
				Type:        NamespaceType,
				CPU:         0.30,
				Memory:      9,
				Storage:     2,
				CPUCost:     0.03,
				MemoryCost:  0.91,
				StorageCost: 0.21,
			}
			metricsChildren := []Children{firstNamespaceWithMetrics, secondNamespaceWithMetrics}
			dummyParentWrapper.Children = metricsChildren
			return nil
		}

		return fmt.Errorf("no data found")
	}
}

// TestRetrieveClusterHierarchyNoView ...
func TestRetrieveClusterHierarchyNoView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterHierarchy("")
	expected := JSONDataWrapper{}
	assert.Equal(t, expected, got)
}

// TestRetrieveClusterHierarchyLogicalView ...
func TestRetrieveClusterHierarchyLogicalView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterHierarchy(Logical)
	firstNamespace := Children{
		Name: "namespace-first",
		Type: NamespaceType,
	}
	secondNamespace := Children{
		Name: "namespace-second",
		Type: NamespaceType,
	}
	hierarchyChildren := []Children{firstNamespace, secondNamespace}
	expected := JSONDataWrapper{
		Data: ParentWrapper{
			Name:     "cluster",
			Type:     "cluster",
			Children: hierarchyChildren,
		},
	}
	assert.Equal(t, expected, got)
}

// TestRetrieveClusterHierarchyPhysicalView ...
func TestRetrieveClusterHierarchyPhysicalView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterHierarchy(Physical)
	firstNamespace := Children{
		Name: "namespace-first",
		Type: NamespaceType,
	}
	secondNamespace := Children{
		Name: "namespace-second",
		Type: NamespaceType,
	}
	hierarchyChildren := []Children{firstNamespace, secondNamespace}
	expected := JSONDataWrapper{
		Data: ParentWrapper{
			Name:     "cluster",
			Type:     "cluster",
			Children: hierarchyChildren,
		},
	}
	assert.Equal(t, expected, got)
}

// TestRetrieveClusterMetricsNoView ...
func TestRetrieveClusterMetricsNoView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterMetrics("")
	expected := JSONDataWrapper{}
	assert.Equal(t, expected, got)
}

// TestRetrieveClusterMetricsLogicalView ...
func TestRetrieveClusterMetricsLogicalView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterMetrics(Logical)
	firstNamespaceWithMetrics := Children{
		Name:        "namespace-first",
		Type:        NamespaceType,
		CPU:         0.90,
		Memory:      3,
		Storage:     1,
		CPUCost:     0.09,
		MemoryCost:  0.31,
		StorageCost: 0.11,
	}
	secondNamespaceWithMetrics := Children{
		Name:        "namespace-second",
		Type:        NamespaceType,
		CPU:         0.30,
		Memory:      9,
		Storage:     2,
		CPUCost:     0.03,
		MemoryCost:  0.91,
		StorageCost: 0.21,
	}
	metricsChildren := []Children{firstNamespaceWithMetrics, secondNamespaceWithMetrics}
	expected := JSONDataWrapper{
		Data: ParentWrapper{
			Name:        "cluster",
			Type:        "cluster",
			Children:    metricsChildren,
			CPU:         1.2,
			Memory:      12,
			Storage:     3,
			CPUCost:     0.12,
			MemoryCost:  1.22,
			StorageCost: 0.32,
		},
	}
	assert.Equal(t, expected, got)
}

// TestRetrieveClusterMetricsPhysicalView ...
func TestRetrieveClusterMetricsPhysicalView(t *testing.T) {
	mockDgraphForClusterQueries()
	got := RetrieveClusterMetrics(Physical)
	firstNamespaceWithMetrics := Children{
		Name:        "namespace-first",
		Type:        NamespaceType,
		CPU:         0.90,
		Memory:      3,
		Storage:     1,
		CPUCost:     0.09,
		MemoryCost:  0.31,
		StorageCost: 0.11,
	}
	secondNamespaceWithMetrics := Children{
		Name:        "namespace-second",
		Type:        NamespaceType,
		CPU:         0.30,
		Memory:      9,
		Storage:     2,
		CPUCost:     0.03,
		MemoryCost:  0.91,
		StorageCost: 0.21,
	}
	metricsChildren := []Children{firstNamespaceWithMetrics, secondNamespaceWithMetrics}
	expected := JSONDataWrapper{
		Data: ParentWrapper{
			Name:        "cluster",
			Type:        "cluster",
			Children:    metricsChildren,
			CPU:         1.20,
			Memory:      12,
			Storage:     3,
			CPUCost:     0.12,
			MemoryCost:  1.22,
			StorageCost: 0.32,
		},
	}
	assert.Equal(t, expected, got)
}