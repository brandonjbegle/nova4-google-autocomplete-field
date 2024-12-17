<template>
  <!--  <div>here?</div>-->
  <default-field :field="this.field">
    <template #field>
      <div class="form-group flex">
        <vue-google-autocomplete
            ref="address"
            :id="this.field.name"
            class="w-full form-control form-input form-input-bordered"
            :class="errorClasses"
            :placeholder="placeholder"
            :country="this.field.countries"
            :types="this.field.type"
            v-model="value"
            v-on:keypress.enter.prevent=""
            v-on:placechanged="getAddressData">
        </vue-google-autocomplete>
        <button type="button" class="rounded bg-primary-500 ml-2 text-white px-3" @click="getCurrentLocation" v-if="this.field.currentLocationButton">
          <span class="flex justify-center items-center" v-if="loadingCurrentLocation">
            <span class="spin-load ease-linear rounded-full border-2 border-t-2 border-white"></span>
          </span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="12" width="12" fill="white">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
                d="M176 256C176 211.8 211.8 176 256 176C300.2 176 336 211.8 336 256C336 300.2 300.2 336 256 336C211.8 336 176 300.2 176 256zM256 0C273.7 0 288 14.33 288 32V66.65C368.4 80.14 431.9 143.6 445.3 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H445.3C431.9 368.4 368.4 431.9 288 445.3V480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480V445.3C143.6 431.9 80.14 368.4 66.65 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H66.65C80.14 143.6 143.6 80.14 224 66.65V32C224 14.33 238.3 0 256 0zM128 256C128 326.7 185.3 384 256 384C326.7 384 384 326.7 384 256C384 185.3 326.7 128 256 128C185.3 128 128 185.3 128 256z"/>
          </svg>
        </button>
      </div>

      <p v-if="value != ''" class="my-2 text-success">{{ translate.current_address }}: {{ value }}</p>

      <p v-if="hasError" class="help-text error-text mt-2 text-danger">
        {{ firstError }}
      </p>
    </template>
  </default-field>
</template>

<script>
import {FormField, HandlesValidationErrors} from 'laravel-nova'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  components: {VueGoogleAutocomplete},

  mixins: [FormField, HandlesValidationErrors],

  props: ['resourceName', 'resourceId', 'field'],

  data: function () {
    return {
      address: '',
      loadingCurrentLocation: false
    }
  },

  computed: {
    translate() {
      return Nova.appConfig.google_autocomplete_translations
    },

    placeholder() {
      if (this.value != '') {
        return this.translate.update_address
      }

      return this.field.name
    }
  },

  methods: {
   getCurrentLocation() {
  this.loadingCurrentLocation = true;
  this.$nextTick(() => {
    if (this.$refs.address && this.$refs.address.geolocate) {
      this.$refs.address.geolocate();
    } else {
      console.error("VueGoogleAutocomplete: Address input is not ready.");
      this.loadingCurrentLocation = false;
    }
  });
},
    /**
     * Get address
     */
    getAddressData(addressData, placeResultData) {
      this.loadingCurrentLocation = false;
      // Save current data address as a string
      this.handleChange(placeResultData.formatted_address)

      const retrievedAddress = {};

      // Emmit events to by catch up for the other AddressMetadata fields
      this.field.addressObject.forEach(element => {
        if (element.indexOf('.') < 0) {
          if (addressData.hasOwnProperty(element)) {
            retrievedAddress[element] = addressData[element];
          }
          if (placeResultData.hasOwnProperty(element)) {
            retrievedAddress[element] = placeResultData[element];
          }
        } else {
          // Separates the type
          let value = element.split(".")[0];
          let type = element.split(".")[1]; // long_name or short_name

          for (let i = 0; i < placeResultData.address_components.length; i++) {
            let target = placeResultData.address_components[i];

            if (target.types.includes(value)) {
              retrievedAddress[value] = target[type];
            }
          }
        }
      });

      Nova.$emit('address-metadata-update', {
        ...retrievedAddress
      })
    },

    /*
     * Set the initial, internal value for the field.
     */
    setInitialValue() {
      this.value = this.field.value || ''
    },

    /**
     * Fill the given FormData object with the field's internal value.
     */
    fill(formData) {
      formData.append(this.field.attribute, this.value || '')
    },

    /**
     * Update the field's internal value.
     */
    handleChange(value) {
      this.value = value
    }
  }
}
</script>
<style>
.spin-load {
  border-top-color: #737070;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
  height: 12px;
  width: 12px;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
