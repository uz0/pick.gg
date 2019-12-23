export const REGIONS = ['BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'TR', 'RU', 'PBE'];

export const RULES = {
  LOL: {
    kills: [0, 10],
    deaths: [0, 10],
    assists: [0, 10],
  },
  PUBG: {
    kills: [0, 50],
    place: [1,10],
  }
}

export const GAMES = ['LOL', 'PUBG'];

export const TOURNAMENT_IMAGES = [
  "https://previews.dropbox.com/p/thumb/AArPsNDT8Tyhbo7M7Hkglb9O33WPCtJ3wodBhI9ST44cV7hC8b6RbLEyckp2HEMAszWDfUAb1l7XU2NkSk6R6VXYFvO94iDCA9FifoymHdd2uSBh3p5JgnETwnWcMlPg7fVNQhSKM7ztnXjF_idjePpVG2sK69ljy58BirSLCyD_PTaOxvy9feFh2T0A5O0Tpw85MVIDEdCVbg7E4cujK88ARtvLI3swdahyjE9QY4KkPuHBGhkoD7GP65nw6u3p0hUMV3dHoEfei_UYzeO8zRgdfpGL-wA1JXyYLZnWgf-qzDXX3q2JtMr0VvNJN7SuDwxslGm412s9fGvE5yid5JYZ/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AArkRkr4CIOW1MowoOcR52k7khHO3urkQiP2VbQy0_gtBsr_DKQK564wcvoVD04_qlnXR63jyFPEKQDhe1lJd_CPMdvtt0h7_Hndi5xzJTD3uaL4LTlGB0acWk7Mr-_A-Cs8rwsbn0plqZJsKXdzei1A0IflTo5cH45XGWnOBz5VmeTDwum88lv8yFQeuLulrsFr2oz48LjpLW24yH4xS2dOn7EszhB5AQ0x0IbtgKmkTKV_pvz598oqUXH1Ed_I55alEHkM-g71aDEm0zX7r4nK9vW5lvDB0HAI5eQPTTTS19k6QhDdjzfFp_OSedi9tHA31gzNU1R_8KTebUeNaeBb/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AArHOdADnCYv4MBDaZIPQgxW3ArD27wsZKz9uVf6U6HErMJaMic5e3iwH0vl4V-g55UlhCuuN5iWdrMqPHBpt2d-lo0bJL2Fcetj04z-9WUEV15JJ1uwYumJgZHCay1-hXElaFt84aa_eKW-_iMQcxS_PUwjqtZ4qhj9qS2u3zRul87GyqchGSFd4dcOuZhu9ytIK7uDnYYZvQiAleXrFU2xS9vtnABiawAhOeVLOmvL5AxVcibgosTkgVVnEM8SrnZ9VcMQVgv0S7-ZKZprKxXt89ZSyfY3nCuo8cZCkagZAoWaZ69qZGJ0avxQ0Xvj0gOavH1D4hVQPxo7Lk4s2N1x/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AApKCaS-uM8dE6l1N9PfrpJuqk0k5PkTZ-2S7lEX5V1k65svEUlspBJfDE1f0hFtpXkBQt-nhU-LJatBKvIqBIQdOitYOUIgQS-UE6iajc95gAnu8CsAwm6UHFv-giI7iSswuxzURhI-7D4b7lgDH0rf7fPH33RrLkuyaCj78LDjsv_hui3PLBGAhYRgIaoGc45UGkMf_bdQ_BqBhioYo7qRtAqyovxu2sskeEMo10XJ7ZbFzkJB1PIQhE48brTkhv1tI5DUmbjRFXjXGaIivjzjWvzlSBh5-KPqvOE91lsC3yzBpZZjjO8hNRUD5B2Q7NdRqdyfNAxSWW1HbKtQkxxi/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AAqSHwHYybQsi4_RagE94fkqFHuy-hLHIqowlkZl-V1VDniqvdk-pBcjUog2gnxIY5DJVd7uWFrtIlWRS93nIeOVrJDrXafHidek6nFXX4PVAzhx-id4jf7YAqNHsrLDg8HQ3SHUN59k3WFrrp76jyelGrp_7evZhnYKuE0ZBbua5FkZUlhX7PhCBSgqnnVwskF9TiPH-RJ3xDAAAMIMPd49Z9WrU7-rr43OFr2KnlN2U8N4khJid9EkRdRll9YqhuiDJ_soLEIOOeNIRbQQJPEtvwJCT3kczN54R-13z2GL48LSH3b00GYAiHrOf1SSZHuqYSl4MkaYB6AWvk31n4mR/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AAqvUN6sL6ROZJHBy9KeVjDieb4HyKqd4fQMOiqWj4PxKWfoOjpC_Ua16dPe30LkKXlb3mPaHADex4RmJLdIeKI96hIePizHJNTFcfryXDMlbMFxspxgx3Rg5Ns-4vO4qDmeG7bppc11h046Qr7hW3RYOSV3qbkIBXLATkNrNTHhKhJev8s8rGCEaDa1pcjnAvWvA2AcuPHjg4o9e-vN-nwnfzavj8myZHXCe6uaVNww0uRuPY2uaTwHobtWicVb8yyPAZ9qsFY245T-AUBKSrksXqhLv7CQpZp0VVIP7KRCGU8Fk626idOGQ0lqKyT92LTRQ68_UhnsxUZ636wDqrST/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AApXM97S2EFlzuY8l9cmtLESBQ741XRBlYExAqAmZ7RXlwIVeT91yYfsHud_gC3CM1d8BNy6LvB7fUNgh7GSYInRYelm_jip-PIEnuhbxN9sSEfCIXMw5dr-bZY_6HVSx_L6wapLF0ULNf-ymNuPEo5lwrEsoLCAjrwDe7lcX-a3sMaR1-8ROZxlglRPsvcLYfK3g8P_8zIxviNR8cozC523-BO58RJqNC4aTo9wHN22zozUxsiu77rofQUhYjLtzm53HTwjrqNpZb_3gJ9BPClbT7ILTmsvsH7HawFvmkMASOYAUOUAZoWQUG_grpzNXIv9mwndfm6Ov3-wx374E3dV/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AAq844gHDhfxWD_en2plE-uSA38iKIj5ubREGaZtgXWBceX7UMyPf-vKbeB1mTviDVD3VKQ_xbSjUiwFTJUJtfCH6-b2F0oUXWCB4CMFdb1Nk8OhfmxU2vs0f69xCygWfXJCqO-YdOpa_SN5KFlri1Xo8W1m8UlvsrV4n1OYBHyT4yN4Bn7b6cws57SVugl1rLBqU1qVRQ059K3A0W0DiKTUrkc-PcZUtEVhZ75tefx7CkDaHcIj0sX8a2L45xpy2-k_YbOvNQLMSdDNix5-scoXBZVfOotmrs4ZrgEFt19ZJqANP06YKZiqSGjhKEwoml1UyJ2OGSAAY0x2CBw0jhFV/p.jpeg",
  "https://previews.dropbox.com/p/thumb/AArvkLVAjuRg99Prb-FxUNWlHXu9Jp0uJKpLcwwuptIum9Yrun_5u8fyP97DRpKyG4QEdhWQWjI_gwj7JdSih_wREHWIZQbcVPAattSle-BFy609kDp08rKVQdFzniqXnRLuE9yTJ06VqbwD4geVKypwokkeWm3hoJgsuZSjgLYVzE13BfpQeNkDYMi8P8CBQpTkPwrreH5sUtxI6Fq4O_9kZRt8imfx0wYXlyKxOluO-YwytzkV09MHm5v1DbhzbGKf7PNLg6_dJy6USgvgD6Tj8A4A-vWwEOBCCpX5AT9ovT4e_Msd_SFpGw6wyJnMwiU0zHPqTTdTRjEFqi0yID_1/p.jpeg"
]