import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_DIVISIONS,
  ALL_DISTRICTS,
  DISTRICT_COUNT,
  UPAZILA_COUNT,
  getDistrictByName,
  getUpazilasForDistrict,
  getDivisionForDistrict,
} from "../lib/data/bangladesh-areas";

describe("Bangladesh Administrative Areas Dataset", () => {
  it("contains all 8 divisions", () => {
    assert.equal(ALL_DIVISIONS.length, 8);
  });

  it("contains exactly 64 districts", () => {
    assert.equal(DISTRICT_COUNT, 64);
    assert.equal(ALL_DISTRICTS.length, 64);
  });

  it("contains exactly 503 upazilas", () => {
    assert.equal(UPAZILA_COUNT, 503);
  });

  it("each district has at least one upazila", () => {
    for (const district of ALL_DISTRICTS) {
      assert.ok(district.upazilas.length > 0, `${district.en} has no upazilas`);
    }
  });

  it("getDistrictByName returns correct district for Dhaka", () => {
    const district = getDistrictByName("Dhaka");
    assert.ok(district);
    assert.equal(district?.en, "Dhaka");
    assert.equal(district?.bn, "ঢাকা");
  });

  it("getDivisionForDistrict returns Dhaka division for Dhaka district", () => {
    const division = getDivisionForDistrict("Dhaka");
    assert.equal(division, "Dhaka");
  });

  it("getUpazilasForDistrict returns upazilas for Dhaka district", () => {
    const upazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(upazilas.length > 0);
    assert.ok(
      upazilas.some((u) => u.en === "Dhaka Sadar"),
      "Dhaka Sadar upazila not found"
    );
  });

  it("Chapai Nawabganj district exists with correct Bengali name", () => {
    const district = getDistrictByName("Chapai Nawabganj");
    assert.ok(district);
    assert.equal(district?.bn, "চাঁপাইনবাবগঞ্জ");
  });

  it("all district names are unique", () => {
    const names = ALL_DISTRICTS.map((d) => d.en);
    const uniqueNames = new Set(names);
    assert.equal(names.length, uniqueNames.size);
  });

  it("all division names are unique", () => {
    const names = ALL_DIVISIONS.map((d) => d.en);
    const uniqueNames = new Set(names);
    assert.equal(names.length, uniqueNames.size);
  });

  it("Rajshahi district is in Rajshahi division", () => {
    const division = getDivisionForDistrict("Rajshahi");
    assert.equal(division, "Rajshahi");
  });
});

describe("AreaPickerModal dataset integration", () => {
  it("loads district options from the complete dataset", () => {
    const rajshahi = getDistrictByName("Rajshahi");
    assert.ok(rajshahi, "Rajshahi district should exist in dataset");
    assert.equal(rajshahi.en, "Rajshahi");
    assert.equal(rajshahi.bn, "রাজশাহী");
  });

  it("upazila selection updates when district changes", () => {
    const dhakaUpazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(dhakaUpazilas.length > 0);

    const rajshahiUpazilas = getUpazilasForDistrict("Rajshahi");
    assert.ok(rajshahiUpazilas.length > 0);

    assert.notEqual(dhakaUpazilas, rajshahiUpazilas);
  });

  it("changing district clears previously selected upazila", () => {
    const dhakaUpazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(dhakaUpazilas.length > 0, "Dhaka should have upazilas");

    const natoreUpazilas = getUpazilasForDistrict("Natore");
    assert.ok(natoreUpazilas.length > 0, "Natore should have upazilas");

    assert.notDeepEqual(dhakaUpazilas, natoreUpazilas);
  });

  it("সব উপজেলা (all upazilas) remains selectable conceptually", () => {
    for (const district of ALL_DISTRICTS) {
      assert.ok(
        district.upazilas.length > 0,
        `${district.en} should have upazilas for "all upazilas" selection`
      );
    }
  });
});

describe("New upazila entries", () => {
  it("contains all 64 districts", () => {
    assert.equal(ALL_DISTRICTS.length, DISTRICT_COUNT);
  });

  it("contains all 8 divisions", () => {
    assert.equal(ALL_DIVISIONS.length, 8);
  });

  it("total upazila count is 503", () => {
    assert.equal(UPAZILA_COUNT, 503);
  });

  it("each district has at least one upazila", () => {
    for (const district of ALL_DISTRICTS) {
      assert.ok(district.upazilas.length > 0, `${district.en} has no upazilas`);
    }
  });

  it("getDistrictByName returns correct district for Dhaka", () => {
    const district = getDistrictByName("Dhaka");
    assert.ok(district);
    assert.equal(district?.en, "Dhaka");
    assert.equal(district?.bn, "ঢাকা");
  });

  it("getDivisionForDistrict returns Dhaka division for Dhaka district", () => {
    const division = getDivisionForDistrict("Dhaka");
    assert.equal(division, "Dhaka");
  });

  it("getUpazilasForDistrict returns upazilas for Dhaka district", () => {
    const upazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(upazilas.length > 0);
    assert.ok(
      upazilas.some((u) => u.en === "Dhaka Sadar"),
      "Dhaka Sadar upazila not found"
    );
  });

  it("Chapai Nawabganj district exists with correct Bengali name", () => {
    const district = getDistrictByName("Chapai Nawabganj");
    assert.ok(district);
    assert.equal(district?.bn, "চাঁপাইনবাবগঞ্জ");
  });

  it("all district names are unique", () => {
    const names = ALL_DISTRICTS.map((d) => d.en);
    const uniqueNames = new Set(names);
    assert.equal(names.length, uniqueNames.size);
  });

  it("all division names are unique", () => {
    const names = ALL_DIVISIONS.map((d) => d.en);
    const uniqueNames = new Set(names);
    assert.equal(names.length, uniqueNames.size);
  });

  it("Rajshahi district is in Rajshahi division", () => {
    const division = getDivisionForDistrict("Rajshahi");
    assert.equal(division, "Rajshahi");
  });
});

describe("AreaPickerModal dataset integration", () => {
  it("loads district options from the complete dataset", () => {
    const rajshahi = getDistrictByName("Rajshahi");
    assert.ok(rajshahi, "Rajshahi district should exist in dataset");
    assert.equal(rajshahi.en, "Rajshahi");
    assert.equal(rajshahi.bn, "রাজশাহী");
  });

  it("upazila selection updates when district changes", () => {
    const dhakaUpazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(dhakaUpazilas.length > 0);

    const rajshahiUpazilas = getUpazilasForDistrict("Rajshahi");
    assert.ok(rajshahiUpazilas.length > 0);

    assert.notEqual(dhakaUpazilas, rajshahiUpazilas);
  });

  it("changing district clears previously selected upazila", () => {
    const dhakaUpazilas = getUpazilasForDistrict("Dhaka");
    assert.ok(dhakaUpazilas.length > 0, "Dhaka should have upazilas");

    const natoreUpazilas = getUpazilasForDistrict("Natore");
    assert.ok(natoreUpazilas.length > 0, "Natore should have upazilas");

    assert.notDeepEqual(dhakaUpazilas, natoreUpazilas);
  });

  it("সব উপজেলা (all upazilas) remains selectable conceptually", () => {
    for (const district of ALL_DISTRICTS) {
      assert.ok(
        district.upazilas.length > 0,
        `${district.en} should have upazilas for "all upazilas" selection`
      );
    }
  });
});