import AutocompleteIndexField from "./components/GoogleAutocomplete/IndexField"
import AutocompleteDetailField from "./components/GoogleAutocomplete/DetailField"
import AutocompleteFormField from "./components/GoogleAutocomplete/FormField"

import MetadataIndexField from "./components/AddressMetadata/IndexField"
import MetadataDetailField from "./components/AddressMetadata/DetailField"
import MetadataFormField from "./components/AddressMetadata/FormField"

Nova.booting((app, router) => {
    app.component('index-google-autocomplete', AutocompleteIndexField);
    app.component('detail-google-autocomplete', AutocompleteDetailField);
    app.component('form-google-autocomplete', AutocompleteFormField);

    app.component('index-address-metadata', MetadataIndexField);
    app.component('detail-address-metadata', MetadataDetailField);
    app.component('form-address-metadata', MetadataFormField);
})
