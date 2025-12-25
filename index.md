---
layout: default
title: "Handyman in New York"
description: "Repairs, installation, and decoration with precision and style."
---

<main id="main">
  {% include hero.html %}
  {% include tiles.html %}
  {% include textblock.html %}
  {% include contacts.html %}
</main>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"{{ site.company }}",
  "url":"{{ site.url }}{{ site.baseurl }}/",
  "telephone":"{{ site.phone_raw }}",
  "email":"{{ site.email }}",
  "address":{
    "@type":"PostalAddress",
    "addressLocality":"{{ site.contact.city }}",
    "addressRegion":"{{ site.contact.region }}",
    "addressCountry":"USA"
  },
  "areaServed":{
    "@type":"Place",
    "name":"New York City"
  },
  "description":"{{ site.description }}"
}
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebSite",
  "@id":"{{ site.url }}{{ site.baseurl }}/#website",
  "url":"{{ site.url }}{{ site.baseurl }}/",
  "name":"{{ site.company }}",
  "description":"{{ site.description }}"
}
</script>
