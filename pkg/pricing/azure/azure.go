package azure

import (
	json "encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	s "strings"
)

//Pricing stores pricing
type Pricing struct {
	Name                  string  `json:"name"`
	CanonicalName         string  `json:"canonicalname"`
	NumberOfCores         int     `json:"numberOfCores"`
	OsDiskSizeInMB        int     `json:"osDiskSizeInMB"`
	ResourceDiskSizeInMB  int     `json:"resourceDiskSizeInMB"`
	MemoryInMB            int     `json:"memoryInMB"`
	MaxDataDiskCount      int     `json:"maxDataDiskCount"`
	RegionName            string  `json:"regionName"`
	LinuxPrice            float64 `json:"linuxPrice"`
	WidowsPrice           float64 `json:"windowsPrice"`
	PricePerCoreLinux     float64 `json:"pricePerCoreLinux"`
	PricePerMemoryLinux   float64 `json:"pricePerMemoryLinux"`
	PricePerCoreWindows   float64 `json:"pricePerCoreWindows"`
	PricePerMemoryWindows float64 `json:"pricePerMemoryWindows"`
}

func getAzureRateCard(region string) ([]*Pricing, error) {
	// Make HTTP GET request
	resp, err := http.Get(getAzureURLForRegion(region))
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	var Pricing []*Pricing
	if resp.StatusCode == http.StatusOK {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		bodyString := string(bodyBytes)
		jsonStringStart := s.Split(bodyString, "json = ")[1]
		jsonStringEnd := s.Replace(s.Split(jsonStringStart, "</script>")[0], ";", "", 1)
		json.Unmarshal([]byte(jsonStringEnd), &Pricing)
	}
	return Pricing, nil
}

//GetAzurePricingUrl function details
//input:region
//return azurePrice url for the region
func getAzureURLForRegion(region string) string {
	return "https://www.azureprice.net/?region=" + region + "&timeoption=hour"
}