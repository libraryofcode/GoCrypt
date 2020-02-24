export default class Certificate {
  public subject: {
    /**
     * Country code for said country, a list can be found here: https://clients.hostingireland.ie/knowledgebase/2042/2-letter-country-codes-for-CSR-generation.html
     * The code should be only two characters in length. You can have multiple country codes, but you should only have one.
     * @example 'US'
     */
    country?: string[],
    /**
     * The name of the organization, frequently used in OV validated certificates. You can have multiple organization names, but you should only have one.
     * @example 'Library of Code sp-us'
     */
    organization?: string[],
    /**
     * The department, division, or function of the organization. This is frequently used in OV certificates, you can have multiple entires but you usually only need one.
     * @example 'Faculty Marshals'
     */
    organizationalUnit?: string[],
    streetAddress?: string[],
    postalCode?: string[]
    /**
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };

  public issuer: {
    /**
     * Country code for said country, a list can be found here: https://clients.hostingireland.ie/knowledgebase/2042/2-letter-country-codes-for-CSR-generation.html
     * The code should be only two characters in length. You can have multiple country codes, but you should only have one.
     * @example 'US'
     */
    country?: string[],
    /**
     * The name of the organization, frequently used in OV validated certificates. You can have multiple organization names, but you should only have one.
     * @example 'Library of Code sp-us'
     */
    organization?: string[],
    /**
     * The department, division, or function of the organization. This is frequently used in OV certificates, you can have multiple entires but you usually only need one.
     * @example 'Faculty Marshals'
     */
    organizationalUnit?: string[],
    streetAddress?: string[],
    postalCode?: string[]
    /**
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };
}
